import UserLogin from '../pages/user/Login/Login.jsx';
import Register from '../pages/user/Register/Register.jsx';
import StaffLogin from '../pages/staff/Login/Login.jsx';
import ForgetPassword from '../pages/user/ForgetPassword/ForgetPassword.jsx';
import StaffForgetPassword from '../pages/staff/ForgetPassword/ForgetPassword.jsx';
import ResetPassword from '../pages/user/ResetPassword/ResetPassword.jsx';
import StaffResetPassword from '../pages/staff/ResetPassword/ResetPassword.jsx';
import Billing from '../pages/user/Billing/Billing.jsx';
import Settings from '../pages/user/Settings/Settings.jsx';
import AdminDashboard from '../pages/admin/Dashboard/Dashboard.jsx';
import AdminEmployees from '../pages/admin/Employees/Employees.jsx';
import AdminSettings from '../pages/admin/Settings/Settings.jsx';
import AdminProducts from '../pages/admin/Products/Products.jsx';
import StaffUsers from '../pages/staff/Users/Users.jsx';
import EmployeeSettings from '../pages/employee/Settings/Settings.jsx';
import Plans from '../pages/user/Plans/Plans.jsx';
import Success from '../pages/user/Success/Success.jsx';
import AuthenticatedRedirect from '../components/AuthenticatedRedirect/AuthenticatedRedirect.jsx';
import Redirect from '../pages/common/Redirect/Redirect.jsx';
import NotFound from '../pages/common/NotFound/NotFound.jsx';
import Blocked from '../pages/common/Blocked/Blocked.jsx';

const routes = [
  //company
  { path: "/company/login", element: <AuthenticatedRedirect><StaffLogin /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/company/forgot-password", element: <AuthenticatedRedirect><StaffForgetPassword /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/company/reset-password", element: <AuthenticatedRedirect><StaffResetPassword /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/company/common/users", element: <StaffUsers />, protected: true, showSidebar: true },
  { path: "/company", element: <Redirect />, protected: true, showSidebar: true },

  //admin
  { path: "/company/admin/dashboard", element: <AdminDashboard />, protected: true, showSidebar: true },
  { path: "/company/admin/employees", element: <AdminEmployees />, protected: true, showSidebar: true },
  { path: "/company/admin/products", element: <AdminProducts />, protected: true, showSidebar: true },
  { path: "/company/admin/settings", element: <AdminSettings />, protected: true, showSidebar: true },

  //employee
  { path: "/company/employee/settings", element: <EmployeeSettings />, protected: true, showSidebar: true },

  //user
  { path: "/login", element: <AuthenticatedRedirect><UserLogin /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/register", element: <AuthenticatedRedirect><Register /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/forgot-password", element: <AuthenticatedRedirect><ForgetPassword /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/reset-password", element: <AuthenticatedRedirect><ResetPassword /></AuthenticatedRedirect>, protected: false, showSidebar: false },
  { path: "/billing", element: <Billing />, protected: true, showSidebar: true },
  { path: "/plans", element: <Plans />, protected: true, showSidebar: true },
  { path: "/success", element: <Success />, protected: true, showSidebar: false },
  { path: "/settings", element: <Settings />, protected: true, showSidebar: true },
  { path: "/", element: <Redirect />, protected: true, showSidebar: true },

  //common
  { path: "/blocked", element: <Blocked />, protected: false, showSidebar: false },
  { path: "*", element: <NotFound />, protected: false, showSidebar: false },
];

export default routes;
