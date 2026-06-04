import './Form.css';
import '../../../../../styles/authForm.css';
import { Link } from "react-router-dom";

const Form = ({ email, setEmail, emailError, handleReset }) => {

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    return (
        <div className="staff-forget-pass auth-form">
            <div className="title">Forgot your password?</div>
            <div className="description">No problem - just provide us with the e-mail you used when you created your account</div>
            <div className="input-form">
                <div className='input-section'>
                    <div className='input-container'>
                        <label htmlFor='email' className='label'>E-mail</label>
                        <input
                            type='text'
                            name='email'
                            id='email'
                            className={`input ${emailError ? 'input-error' : ''}`}
                            value={email}
                            onChange={handleChange}
                        />
                        {emailError && <div className='error'>{emailError}</div>}
                    </div>
                </div>
                <button className='btn' onClick={handleReset}>Continue</button>
            </div>
            <div className='navigation'>
                <div>Already have an account?</div>
                <Link to='/company/login' className='nav-link'>Log in here</Link>
            </div>
        </div>
    )
};

export default Form;