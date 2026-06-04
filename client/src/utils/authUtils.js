import Cookies from 'js-cookie';
import { menuItems } from '../constants/menuItems';

const isAuthenticated = () => {
    const token = Cookies.get('pondus-jwt-token');
    return !!token;
};

const normalizePath = (path) => {
    // Remove trailing slashes and ensure a consistent format
    return path.replace(/\/+$/, '');
};

const verifyAuthorization = (role) => {
    const currentPath = normalizePath(window.location.pathname);
    if (role === 'user' && currentPath === '/success') {
        return true;
    } else if (currentPath === '' || currentPath === '/company') {
        return true;
    }
    const allowedPages = menuItems[role]?.map(item => item.path) || [];

    return allowedPages.includes(currentPath);
};

export { isAuthenticated, verifyAuthorization };