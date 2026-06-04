import { useState } from 'react';
import './Form.css';
import '../../../../../styles/authForm.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../../../redux/loaderSlice';
import { TbEye } from "react-icons/tb";
import { TbEyeOff } from "react-icons/tb";
import { isValidEmail } from '../../../../../utils/validationUtils';
import userService from '../../../../../services/userService';

const Form = () => {
    const [user, setUser] = useState({
        email: "",
        password: "",
        rememberMe: false
    });
    const [error, setError] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (event) => {
        let name = event.target.name;
        let type = event.target.type;
        let value = event.target.value;

        setUser({ ...user, [name]: type !== 'checkbox' ? value : event.target.checked });
    };

    const togglePasswordView = () => {
        setShowPassword(!showPassword);
    };

    const validateUser = () => {
        let newError = { ...error };
        let errors = false;
        const { email, password } = user;
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
        if (!password) {
            newError.password = 'Password is required!';
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
            const response = await userService.loginUser(user, 'staff');
            if (response.token) {
                Cookies.set('pondus-jwt-token', response.token, {
                    secure: true,
                    sameSite: 'Lax'
                });
                const from = location.state?.from.pathname;
                navigate(from || '/company');
            }
        } catch (error) {
            message.error(error.response.data?.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    return (
        <div className="staff-login-section auth-form">
            <div className='input-form'>
                <div className='input-section'>
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
                <div className='bottom-row'>
                    <div className='remember-container'>
                        <input
                            type='checkbox'
                            name='rememberMe'
                            id='rememberMe'
                            checked={user.rememberMe}
                            onChange={handleChange}
                        />
                        <label htmlFor='rememberMe'>Remember Me</label>
                    </div>
                    <Link to='/company/forgot-password' className='nav-link'>Forgot your password?</Link>
                </div>
                <button className='btn' onClick={handleSubmit}>Log In</button>
            </div>
        </div>
    )
};

export default Form;