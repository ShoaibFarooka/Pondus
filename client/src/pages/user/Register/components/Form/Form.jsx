import { useState } from 'react';
import '../../../../../styles/authForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../../../redux/loaderSlice';
import { TbEye } from "react-icons/tb";
import { TbEyeOff } from "react-icons/tb";
import { isValidEmail, isValidPassword } from '../../../../../utils/validationUtils';
import userService from '../../../../../services/userService';

const Form = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        number: "",
        dateOfBirth: "",
        address: "",
        city: "",
        zip: "",
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
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setUser({ ...user, [name]: value });
    };

    const togglePasswordView = () => {
        setShowPassword(!showPassword);
    };

    const validateUser = () => {
        let newError = { ...error };
        let errors = false;
        const { name, email, number, dateOfBirth, address, city, zip, password } = user;
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
        if (!password) {
            newError.password = 'Password is required!';
            errors = true;
        }
        else if (!isValidPassword(password)) {
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

    const handleSubmit = async () => {
        if (!validateUser()) {
            return;
        }
        dispatch(ShowLoading());
        try {
            const response = await userService.registerUser(user);
            message.success(response?.message);
            navigate('/login');
        } catch (error) {
            message.error(error.response.data?.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    return (
        <div className="auth-form">
            <div className="title">Create your Account</div>
            <div className='input-form'>
                <div className='input-section'>
                    <div className='input-container'>
                        <label htmlFor='name' className='label'>Name</label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            className={`input ${error.name ? 'input-error' : ''}`}
                            value={user.name}
                            onChange={handleChange}
                        />
                        {error.name && <div className='error'>{error.name}</div>}
                    </div>
                    <div className='input-container'>
                        <label htmlFor='email' className='label'>E-mail</label>
                        <input
                            type='text'
                            name='email'
                            id='email'
                            className={`input ${error.email ? 'input-error' : ''}`}
                            value={user.email}
                            onChange={handleChange}
                        />
                        {error.email && <div className='error'>{error.email}</div>}
                    </div>
                    <div className='input-container'>
                        <label htmlFor='number' className='label'>Phone Number</label>
                        <input
                            type='text'
                            name='number'
                            id='number'
                            className={`input ${error.number ? 'input-error' : ''}`}
                            value={user.number}
                            onChange={handleChange}
                        />
                        {error.number && <div className='error'>{error.number}</div>}
                    </div>
                    <div className='input-container'>
                        <label htmlFor='dateOfBirth' className='label'>Date Of Birth</label>
                        <input
                            type='date'
                            name='dateOfBirth'
                            id='dateOfBirth'
                            className={`input ${error.dateOfBirth ? 'input-error' : ''}`}
                            value={user.dateOfBirth}
                            onChange={handleChange}
                        />
                        {error.dateOfBirth && <div className='error'>{error.dateOfBirth}</div>}
                    </div>
                    <div className='input-container'>
                        <label htmlFor='address' className='label'>Address</label>
                        <input
                            type='text'
                            name='address'
                            id='address'
                            className={`input ${error.address ? 'input-error' : ''}`}
                            value={user.address}
                            onChange={handleChange}
                        />
                        {error.address && <div className='error'>{error.address}</div>}
                    </div>
                    <div className='input-container'>
                        <label htmlFor='city' className='label'>City</label>
                        <input
                            type='text'
                            name='city'
                            id='city'
                            className={`input ${error.city ? 'input-error' : ''}`}
                            value={user.city}
                            onChange={handleChange}
                        />
                        {error.city && <div className='error'>{error.city}</div>}
                    </div>
                    <div className='input-container'>
                        <label htmlFor='zip' className='label'>ZIP</label>
                        <input
                            type='text'
                            name='zip'
                            id='zip'
                            className={`input ${error.zip ? 'input-error' : ''}`}
                            value={user.zip}
                            onChange={handleChange}
                        />
                        {error.zip && <div className='error'>{error.zip}</div>}
                    </div>
                    <div className='input-container'>
                        <label htmlFor='password' className='label'>Password</label>
                        <div className='pass-container'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name='password'
                                id='password'
                                className={`input ${error.password ? 'input-error' : ''}`}
                                value={user.password}
                                onChange={handleChange}
                            />
                            {!showPassword ?
                                <TbEye size={18} className='eye-icon' onClick={togglePasswordView} />
                                :
                                <TbEyeOff size={18} className='eye-icon' onClick={togglePasswordView} />
                            }
                        </div>
                        {error.password && <div className='error'>{error.password}</div>}
                    </div>
                </div>
                <button className='btn' onClick={handleSubmit}>Continue</button>
            </div>
            <div className='navigation'>
                <div>Already have an account?</div>
                <Link to='/login' className='nav-link'>Log in here</Link>
            </div>
        </div>
    )
};

export default Form;