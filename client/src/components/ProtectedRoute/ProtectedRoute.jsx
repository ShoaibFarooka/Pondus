import React, { useState, useEffect } from 'react';
import './ProtectedRoute.css';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, verifyAuthorization } from '../../utils/authUtils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../../redux/userSlice.js';
import Sidebar from '../Sidebar/Sidebar.jsx';
import Unauthorized from '../../pages/common/Unauthorized/Unauthorized.jsx';

const ProtectedRoute = ({ children, showSidebar, ...rest }) => {
    const location = useLocation();
    const redirectTo = location.pathname.startsWith('/company') ? '/company/login' : '/login';
    const isAuth = isAuthenticated();
    const [isAuthorized, setIsAuthorized] = useState('pending');
    const hasLoggedOut = useSelector(state => state.logout.hasLoggedOut);
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuth && (isAuthorized === 'pending' || isAuthorized === 'no')) {
            // console.log('Called with user: ', user);
            if (!user) {
                dispatch(fetchUserInfo());
            }
            else {
                const authorized = verifyAuthorization(user.role);
                setIsAuthorized(authorized ? 'yes' : 'no');
            }
        }
    }, [isAuth, location, user]);

    return isAuth ? (
        <div className='page'>
            {(showSidebar && user) && <Sidebar />}
            {isAuthorized === 'pending' ?
                <div className='content'></div>
                :
                isAuthorized === 'yes' ?
                    <div className={`content ${showSidebar ? 'margin-content' : 'full-content'}`}>
                        {React.cloneElement(children, { ...rest })}
                    </div>
                    :
                    <div className={`content ${showSidebar ? 'margin-content' : 'full-content'}`}>
                        <Unauthorized />
                    </div>
            }
        </div>
    ) : (
        <>
            {
                hasLoggedOut ?
                    <Navigate to={redirectTo} />
                    :
                    <Navigate to={redirectTo} replace state={{ from: location }} />
            }
        </>
    );
};

export default ProtectedRoute;
