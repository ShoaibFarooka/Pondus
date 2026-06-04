import './ResendEmail.css';
import '../../../../../styles/authForm.css';
import { Link } from "react-router-dom";

const ResendEmail = ({ handleReset, setView }) => {

    return (
        <div className="staff-resend-email auth-form">
            <div className="title">Check your e-mail</div>
            <div className="description">You should have received instructions on how to recover your account through the e-mail you’ve provided</div>
            <div className="input-form">
                <button className='btn' onClick={handleReset}>Resend E-mail</button>
            </div>
            <div className='navigation navigation-1'>
                <div>I didn’t receive anything.</div>
                <div className='back-link' onClick={() => setView(0)}>Try a different e-mail</div>
            </div>
            <div className='navigation navigation-2'>
                <div>Already have an account?</div>
                <Link to='/company/login' className='nav-link'>Log in here</Link>
            </div>
        </div>
    )
};

export default ResendEmail;