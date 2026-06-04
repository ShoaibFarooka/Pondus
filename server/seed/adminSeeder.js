const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config({path: "./configs/.env"});
const authUtils = require('../utils/authUtils');

async function seedAdmin(userData) {
    const DB = process.env.DB_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB);
    console.log('Connected to MongoDB');
    try {
        // await User.deleteMany({});
        console.log('Deleted existing users');
        console.log('Seeding admin...');
        const { name, email, number, dateOfBirth, address, city, zip, password, role } = userData;
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return console.log('A user with that email has already been registered!');
        }
        existingUser = await User.findOne({ number });
        if (existingUser) {
            return console.log('A user with that number has already been registered!');
        }
        let passwordDigest = await authUtils.hashPassword(password);
        await User.create({
            name,
            email,
            number,
            dateOfBirth,
            address,
            city,
            zip,
            password: passwordDigest,
            role
        });
        console.log('Admin Seeded Successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

const admin = {
    name: "Admin Test",
    email: "admin@gmail.com",
    number: "+923370396721",
    dateOfBirth: "1990-05-17",
    address: "test address",
    city: "London",
    zip: "90492",
    password: "12345678",
    role: "admin"
}

seedAdmin(admin);
