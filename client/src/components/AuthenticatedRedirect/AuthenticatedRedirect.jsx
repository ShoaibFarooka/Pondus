import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/authUtils';

const AuthenticatedRedirect = ({ children, ...rest }) => {
    const location = useLocation();
    const isAuth = isAuthenticated();

    if (isAuth) {
        // Check if the current path starts with '/company'
        if (location.pathname.startsWith('/company')) {
            return <Navigate to="/company" replace state={{ from: location }} />;
        }
        // Default redirect path
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return React.cloneElement(children, { ...rest });
};

export default AuthenticatedRedirect;
