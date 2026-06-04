import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Redirect = () => {
    const { user } = useSelector(state => state.user);

    if (user.role === 'admin') {
        return <Navigate to="/company/admin/dashboard" />;
    } else if (user.role === 'employee') {
        return <Navigate to="/company/common/users" />;
    } else if (user.role === 'user') {
        return <Navigate to="/billing" />;
    }
};

export default Redirect;