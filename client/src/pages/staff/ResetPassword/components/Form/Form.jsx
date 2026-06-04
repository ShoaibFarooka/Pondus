import { useState, useEffect } from 'react';
import '../../../../../styles/authForm.css';
import { TbEye } from "react-icons/tb";
import { TbEyeOff } from "react-icons/tb";
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../../../redux/loaderSlice';
import { isValidPassword } from '../../../../../utils/validationUtils';
import userService from '../../../../../services/userService';

const Form = () => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmNewPassword: ''
    });
    const [error, setError] = useState({
        newPassword: '',
        confirmNewPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmNewPassword: false
    });
    const [token, setToken] = useState(null);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        console.log('Token: ', token);
        if (token) {
            setToken(token);
        }
        else {
            message.error('Invalid reset link!');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    };

    const togglePasswordView = (key) => {
        setShowPassword({
            ...showPassword,
            [key]: !showPassword[key]
        })
    };

    const validatePassword = () => {
        let errors = false;
        let newError = { ...error };
        const { newPassword, confirmNewPassword } = formData;
        if (!newPassword) {
            newError.newPassword = 'New Password is required!';
            errors = true;
        }
        else if (!isValidPassword(newPassword)) {
            newError.newPassword = 'Password must be at least 8 character long!';
            errors = true;
        }
        else {
            newError.newPassword = '';
        }
        if (!confirmNewPassword) {
            newError.confirmNewPassword = 'Confirm Password is required!';
            errors = true;
        }
        else if (confirmNewPassword !== newPassword) {
            newError.confirmNewPassword = "Password doesn't match!";
            errors = true;
        }
        else {
            newError.confirmNewPassword = '';
        }
        setError(newError);
        if (errors) {
            return false;
        }
        return true;
    };

    const handleUpdate = async () => {
        if (!validatePassword()) {
            return;
        }
        dispatch(ShowLoading());
        try {
            const data = {
                token,
                newPassword: formData.newPassword
            };
            const response = await userService.resetPassword(data);
            message.success(response?.message);
            navigate('/company/login');
        } catch (error) {
            message.error(error.response.data?.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    return (
        <div className="staff-reset-pass auth-form">
            <div className="title">Reset Password</div>
            <div className="input-form">
                <div className='input-section'>
                    <div className='input-container'>
                        <label htmlFor='newPassword' className='label'>Enter new password</label>
                        <div className='pass-container'>
                            <input
                                type={showPassword.newPassword ? 'text' : 'password'}
                                name='newPassword'
                                id='newPassword'
                                className={`input ${error.newPassword ? 'input-error' : ''}`}
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                            {!showPassword.newPassword ?
                                <TbEye size={18} className='eye-icon' onClick={() => togglePasswordView('newPassword')} />
                                :
                                <TbEyeOff size={18} className='eye-icon' onClick={() => togglePasswordView('newPassword')} />
                            }
                        </div>
                        {error.newPassword && <div className='error'>{error.newPassword}</div>}
                    </div>
                    <div className='input-container'>
                        <label htmlFor='confirmNewPassword' className='label'>Confirm new password</label>
                        <div className='pass-container'>
                            <input
                                type={showPassword.confirmNewPassword ? 'text' : 'password'}
                                name='confirmNewPassword'
                                id='confirmNewPassword'
                                className={`input ${error.confirmNewPassword ? 'input-error' : ''}`}
                                value={formData.confirmNewPassword}
                                onChange={handleChange}
                            />
                            {!showPassword.confirmNewPassword ?
                                <TbEye size={18} className='eye-icon' onClick={() => togglePasswordView('confirmNewPassword')} />
                                :
                                <TbEyeOff size={18} className='eye-icon' onClick={() => togglePasswordView('confirmNewPassword')} />
                            }
                        </div>
                        {error.confirmNewPassword && <div className='error'>{error.confirmNewPassword}</div>}
                    </div>
                </div>
                <button className='btn' disabled={!token} onClick={handleUpdate}>Update Password</button>
            </div>
        </div>
    )
};

export default Form;