import { useState, useEffect } from 'react';
import './UserForm.css';
import UserImage from '../../assets/images/user_icon.png';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { TbEye } from "react-icons/tb";
import { TbEyeOff } from "react-icons/tb";
import { isValidEmail, isValidPassword } from '../../utils/validationUtils';

const UserForm = ({ user, userType, actionType, handleSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        dateOfBirth: "",
        address: "",
        city: "",
        zip: "",
        notes: "",
        password: ""
    });
    const [error, setError] = useState({
        name: "",
        email: "",
        number: "",
        dateOfBirth: "",
        address: "",
        city: "",
        zip: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user && actionType === "edit") {
            const updatedFormData = {
                name: user.name || "",
                email: user.email || "",
                number: user.number || "",
                dateOfBirth: user.dateOfBirth || "",
                address: user.address || "",
                city: user.city || "",
                zip: user.zip || "",
                notes: user.notes || "",
                password: ""
            };
            setFormData(updatedFormData);
        }
    }, [user]);

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setFormData({ ...formData, [name]: value });
    };

    const togglePasswordView = () => {
        setShowPassword(!showPassword);
    };

    const handleQuillChange = (value) => {
        setFormData({ ...formData, notes: value });
    };

    const validateUser = () => {
        let newError = { ...error };
        let errors = false;
        const { name, email, number, dateOfBirth, address, city, zip, password } = formData;
        if (!name) {
            newError.name = 'Name is required!';
            errors = true;
        }
        else {
            newError.name = '';
        }
        if (!email) {
            newError.email = 'Email is required!';
            errors = true;
        }
        else if (!isValidEmail(email)) {
            newError.email = 'Please provide valid email!';
            errors = true;
        }
        else {
            newError.email = '';
        }
        if (!number) {
            newError.number = 'Phone Number is required!';
            errors = true;
        }
        else {
            newError.number = '';
        }
        if (!dateOfBirth) {
            newError.dateOfBirth = 'Date Of Birth is required!';
            errors = true;
        }
        else {
            newError.dateOfBirth = '';
        }
        if (!address) {
            newError.address = 'Address is required!';
            errors = true;
        }
        else {
            newError.address = '';
        }
        if (!city) {
            newError.city = 'City is required!';
            errors = true;
        }
        else {
            newError.city = '';
        }
        if (!zip) {
            newError.zip = 'Zip is required!';
            errors = true;
        }
        else {
            newError.zip = '';
        }
        if (!password && actionType === 'add') {
            newError.password = 'Password is required!';
            errors = true;
        }
        else if (!isValidPassword(password) && actionType === 'add') {
            newError.password = 'Password must be at least 8 characters long!';
            errors = true;
        }
        else {
            newError.password = '';
        }
        setError(newError);
        if (errors) {
            console.log('Error: ', newError);
            return false;
        }
        return true;
    };

    const handleContinue = () => {
        if (!validateUser()) {
            return;
        }
        handleSave(formData);
    };

    return (
        <div className='user-form'>
            {actionType === "edit" &&
                <div className='top-bar'>
                    <div className='flex-row'>
                        <img src={UserImage} alt='user-image' className='user-image' />
                        <div className='name'>{user.name}</div>
                        <div className='member-time'>{userType === 'user' ? 'Member' : 'Employee'} Since: {new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className='flex-row gap-10'>
                        {userType === 'user' &&
                            <>
                                <div className='payment-status-text'>Payment Status: </div>
                                <div className={`payment-status-label ${user.paymentStatus === 'Success' ? 'bg-color-green' : 'bg-color-yellow'}`}>{user.paymentStatus}</div>
                            </>
                        }
                        <button className='chat-btn'>Send message</button>
                    </div>
                </div>
            }
            <div className='main-content'>
                <div className='input-form'>
                    <div className='title'>Details</div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='name' className='label'>Name</label>
                            <input
                                type='text'
                                name='name'
                                id='name'
                                className={`input ${error.name ? 'input-error' : ''}`}
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        {error.name && <div className='error'>{error.name}</div>}
                    </div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='email' className='label'>E-mail</label>
                            <input
                                type='text'
                                name='email'
                                id='email'
                                className={`input ${error.email ? 'input-error' : ''}`}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        {error.email && <div className='error'>{error.email}</div>}
                    </div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='number' className='label'>Phone Number</label>
                            <input
                                type='text'
                                name='number'
                                id='number'
                                className={`input ${error.number ? 'input-error' : ''}`}
                                value={formData.number}
                                onChange={handleChange}
                            />
                        </div>
                        {error.number && <div className='error'>{error.number}</div>}
                    </div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='dateOfBirth' className='label'>Date Of Birth</label>
                            <input
                                type='date'
                                name='dateOfBirth'
                                id='dateOfBirth'
                                className={`input ${error.dateOfBirth ? 'input-error' : ''}`}
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>
                        {error.dateOfBirth && <div className='error'>{error.dateOfBirth}</div>}
                    </div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='address' className='label'>Address</label>
                            <input
                                type='text'
                                name='address'
                                id='address'
                                className={`input ${error.address ? 'input-error' : ''}`}
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                        {error.address && <div className='error'>{error.address}</div>}
                    </div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='city' className='label'>City</label>
                            <input
                                type='text'
                                name='city'
                                id='city'
                                className={`input ${error.city ? 'input-error' : ''}`}
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>
                        {error.city && <div className='error'>{error.city}</div>}
                    </div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='zip' className='label'>ZIP</label>
                            <input
                                type='text'
                                name='zip'
                                id='zip'
                                className={`input ${error.zip ? 'input-error' : ''}`}
                                value={formData.zip}
                                onChange={handleChange}
                            />
                        </div>
                        {error.zip && <div className='error'>{error.zip}</div>}
                    </div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='password' className='label'>Password</label>
                            <div className='pass-container'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    id='password'
                                    className={`input ${error.password ? 'input-error' : ''}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {!showPassword ?
                                    <TbEye size={18} className='eye-icon' onClick={togglePasswordView} />
                                    :
                                    <TbEyeOff size={18} className='eye-icon' onClick={togglePasswordView} />
                                }
                            </div>
                        </div>
                        {error.password && <div className='error'>{error.password}</div>}
                    </div>
                    {/* <button className='save-btn' onClick={handleContinue}>Save</button> */}
                </div>
                <div className='notes'>
                    <div className='title'>Notes</div>
                    <ReactQuill theme="snow" className='text-editor' value={formData.notes} onChange={handleQuillChange} />
                    <button className='save-btn' onClick={handleContinue}>Save</button>
                </div>
            </div>
        </div>
    )
};

export default UserForm;