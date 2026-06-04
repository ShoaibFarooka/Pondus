const { loadDBModel } = require('../utils/modelUtils');
const CryptoJS = require('crypto-js')
const authUtils = require('../utils/authUtils');
const stripeService = require('./stripeService');
const subscriptionService = require('./subscriptionService');

const createUser = async (connectionId, userData) => {
  const User = loadDBModel(connectionId, 'user');
  const { name, email, number, dateOfBirth, address, city, zip, password, role, notes } = userData;
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('A user with that email has already been registered!');
    error.code = 409;
    throw error;
  }
  // existingUser = await User.findOne({ number });
  // if (existingUser) {
  //   const error = new Error('A user with that number has already been registered!');
  //   error.code = 409;
  //   throw error;
  // }
  let passwordDigest = await authUtils.hashPassword(password);
  const user = await User.create({
    name,
    email,
    number,
    dateOfBirth,
    address,
    city,
    zip,
    password: passwordDigest,
    role,
    notes
  });
  return user;
};

const loginUser = async (connectionId, loginData, userType) => {
  const User = loadDBModel(connectionId, 'user');
  const { email, password } = loginData;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User not found!');
    error.code = 404;
    throw error;
  }
  if (!userType.includes(user.role)) {
    const error = new Error('User not found!');
    error.code = 404;
    throw error;
  }
  let passwordMatched = await authUtils.comparePassword(user.password, password);
  if (!passwordMatched) {
    const error = new Error('Invalid credentials!');
    error.code = 400;
    throw error;
  }
  let payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };
  let accessToken = authUtils.createAccessToken(payload);
  let refreshToken = authUtils.createRefreshToken(payload);
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

const createResetToken = async (connectionId, email, requiredRoles) => {
  const User = loadDBModel(connectionId, 'user');
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User not found!');
    error.code = 404;
    throw error;
  }
  if (!requiredRoles.includes(user.role)) {
    const error = new Error('User not found!');
    error.code = 404;
    throw error;
  }
  const randomBytes = CryptoJS.lib.WordArray.random(32);
  const resetToken = randomBytes.toString(CryptoJS.enc.Hex);
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
  await user.save();
  return { user, resetToken };
};

const resetPassword = async (connectionId, token, newPassword) => {
  const User = loadDBModel(connectionId, 'user');
  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) {
    const error = new Error('Invalid or expired token!');
    error.code = 400;
    throw error;
  }
  let passwordDigest = await authUtils.hashPassword(newPassword);
  user.password = passwordDigest;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();
};

const refreshToken = async (connectionId, refreshToken) => {
  const User = loadDBModel(connectionId, 'user');
  if (!refreshToken) {
    const error = new Error('Refresh token not found!');
    error.code = 401;
    throw error;
  }
  const payload = authUtils.verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.id);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error('Invalid refresh token!');
    error.code = 401;
    throw error;
  }
  const newPayload = { id: payload.id, email: payload.email, role: payload.role };
  const newAccessToken = authUtils.createAccessToken(newPayload);
  const newRefreshToken = authUtils.createRefreshToken(newPayload);
  user.refreshToken = newRefreshToken;
  await user.save();
  return { newAccessToken, newRefreshToken };
};

const logoutUser = async (connectionId, refreshToken) => {
  const User = loadDBModel(connectionId, 'user');
  const payload = authUtils.verifyRefreshToken(refreshToken);
  if (payload && payload.id) {
    const user = await User.findById(payload.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }
};

const fetchUser = async (connectionId, userId) => {
  const User = loadDBModel(connectionId, 'user');
  const userProjection = {
    name: 1,
    email: 1,
    number: 1,
    dateOfBirth: 1,
    address: 1,
    city: 1,
    zip: 1,
    role: 1,
    _id: 0
  };
  const user = await User.findById(userId, userProjection);
  if (!user) {
    const error = new Error('User not found!');
    error.code = 404;
    throw error;
  }
  return user;
};

const searchUsers = async (connectionId, pageIndex, limit, searchQuery, role) => {
  const User = loadDBModel(connectionId, 'user');
  const skip = (pageIndex - 1) * limit;
  let query = {};
  if (searchQuery && searchQuery !== '') {
    query = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { phone: { $regex: searchQuery, $options: 'i' } },
      ]
    };
  }
  if (role) {
    query = { ...query, role };
  }
  const totalCount = await User.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);
  const userProjection = {
    name: 1,
    email: 1,
    number: 1,
    dateOfBirth: 1,
    address: 1,
    city: 1,
    zip: 1,
    role: 1,
    notes: 1,
    createdAt: 1
  };
  const users = await User.find(query, userProjection)
    .sort({ createdAt: -1 })  // Sort by createdAt descending (-1)
    .skip(skip)
    .limit(limit);

  if (!users || users.length <= 0) {
    const error = new Error('Users not found!');
    error.code = 404;
    throw error;
  }

  let usersWithSubscription = [];
  if (role === 'user') {
    // Create an array of promises to fetch subscription info for each user
    const subscriptionPromises = users.map(async user => {
      const subscriptionInfo = await subscriptionService.getUserSubscriptionStatus(connectionId, user._id);
      return { ...user.toObject(), ...subscriptionInfo };  // Merge user data with subscription info
    });

    // Await all promises and attach subscription info to users
    usersWithSubscription = await Promise.all(subscriptionPromises);
  }

  return {
    users: role === 'user' ? usersWithSubscription : users,
    totalPages,
    totalCount
  };
};

const updateUser = async (connectionId, stripeConfig, userId, updateData, role = null) => {
  const User = loadDBModel(connectionId, 'user');
  const userToUpdate = await User.findById(userId);

  if (!userToUpdate) {
    const error = new Error('User not found!');
    error.code = 404;
    throw error;
  }
  if (role && userToUpdate.role !== role) {
    const error = new Error('Cannot update other type of user via this endpoint!');
    error.code = 405;
    throw error;
  }
  if (updateData.password) {
    updateData.password = await authUtils.hashPassword(updateData.password);
  }
  let existingUser;
  if (updateData.email && updateData.email !== userToUpdate.email) {
    existingUser = await User.findOne({ email: updateData.email });
    if (existingUser) {
      const error = new Error('A user with that email has already been registered!');
      error.code = 409;
      throw error;
    }
  }
  // if (updateData.number && updateData.number !== userToUpdate.number) {
  //   existingUser = await User.findOne({ number: updateData.number });
  //   if (existingUser) {
  //     const error = new Error('A user with that number has already been registered!');
  //     error.code = 409;
  //     throw error;
  //   }
  // }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true }
  );
  if (updateData.email && updateData.email !== userToUpdate.email && updatedUser.stripeCustomerId) {
    console.log('Updating customer email...');
    await stripeService.updateCustomerEmail(stripeConfig, updatedUser.stripeCustomerId, updateData.email);
  }
  return updatedUser;
};

const deleteUser = async (connectionId, userId, role) => {
  const User = loadDBModel(connectionId, 'user');
  const userToDelete = await User.findById(userId);

  if (!userToDelete) {
    const error = new Error('User not found!');
    error.code = 404;
    throw error;
  }
  if (!userToDelete.role === role) {
    const error = new Error('Cannot delete other type of user via this endpoint!');
    error.code = 405;
    throw error;
  }
  const deletedUser = await User.findByIdAndDelete(userId);
  return deletedUser;
};

const changeUserPassword = async (connectionId, userId, oldPassword, newPassword) => {
  const User = loadDBModel(connectionId, 'user');
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found!');
    error.code = 404;
    throw error;
  }
  let passwordMatched = await authUtils.comparePassword(user.password, oldPassword);
  if (!passwordMatched) {
    const error = new Error('Invalid old password!');
    error.code = 400;
    throw error;
  }
  let passwordDigest = await authUtils.hashPassword(newPassword);
  user.password = passwordDigest;
  await user.save();
};

const fetchUserStripeCustomerId = async (connectionId, userId) => {
  const User = loadDBModel(connectionId, 'user');
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found!');
    error.code = 404;
    throw error;
  }
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }
  else {
    return null;
  }
};

// const fetchUserId = async (filter) => {
//   const user = await User.findOne(filter);
//   if (!user) {
//     const error = new Error('User not found!');
//     error.code = 404;
//     throw error;
//   }
//   return user._id.toString();
// };

const test = async () => {
  const user = {
    name: 'Admin Test',
    email: 'admin1@gmail.com',
    number: '+923047845281',
    dateOfBirth: '1990-05-16',
    address: "Johar Town",
    city: "Lahore",
    zip: "7600",
    password: '12345678',
    role: 'admin'
  };
  // await createUser(user);
  // await updateUser('66bfb03e569433a1e72922d3', {});
  // const res = await fetchUserStripeCustomerId('66bfe860c2020fb2f65bedfa');
  const res = await fetchUserId({ stripeCustomerId: 'cus_Qi9WPilK2UqRVt' });
  console.log('ID: ', res);
}

// test();


module.exports = {
  createUser,
  loginUser,
  createResetToken,
  resetPassword,
  refreshToken,
  logoutUser,
  fetchUser,
  searchUsers,
  updateUser,
  deleteUser,
  changeUserPassword,
  fetchUserStripeCustomerId,
  // fetchUserId
};
