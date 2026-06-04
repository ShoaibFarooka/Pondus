import { useState, useEffect } from 'react';
import './Employees.css';
import { IoSearch } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { message, Empty } from 'antd';
import { ShowLoading, HideLoading } from '../../../redux/loaderSlice';
import EmployeesTable from './components/EmployeesTable/EmployeesTable';
import PaginationHandler from '../../../components/PaginationHandler/PaginationHandler';
import CustomModal from '../../../components/CustomModal/CustomModal';
import UserForm from '../../../components/UserForm/UserForm';
import userService from '../../../services/userService';

const Employees = () => {
    const [pageIndex, setPageIndex] = useState(1);
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [paginationConfig, setPaginationConfig] = useState({
        count: 0,
        totalCount: 0,
        totalPages: 0
    });
    const [searchQuery, setSearchQuery] = useState("");
    const limit = 10;
    const dispatch = useDispatch();

    const fetchEmployees = async () => {
        dispatch(ShowLoading());
        try {
            const query = {
                pageIndex,
                limit,
                searchQuery
            }
            const response = await userService.searchEmployees(query);
            if (response.result) {
                setData(response.result.users);
                setPaginationConfig({
                    count: response.result.users.length,
                    totalCount: response.result.totalCount,
                    totalPages: response.result.totalPages
                });
            }
        } catch (error) {
            message.error(error.response.data.error);
            setData([]);
            setPaginationConfig({
                count: 0,
                totalCount: 0,
                totalPages: 0
            });
        } finally {
            dispatch(HideLoading());
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [pageIndex]);

    const handleSearch = () => {
        if (pageIndex !== 1) {
            setPageIndex(1);
        }
        else {
            fetchEmployees();
        }
    };

    const handleAdd = () => {
        setActionType("add");
        setEditUser(null);
        setIsOpen(true);
    };

    const handleEdit = (user) => {
        setActionType("edit");
        setEditUser(user);
        setIsOpen(true);
    };

    const handleDelete = async (user) => {
        const isConfirm = window.confirm('Are you sure?');
        if (!isConfirm) {
            return;
        }
        console.log('Deleting');
        dispatch(ShowLoading());
        try {
            const response = await userService.deleteEmployee(user._id);
            message.success(response.message);
            await fetchEmployees();
        } catch (error) {
            message.error(error.response.data.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    const handleSave = async (user) => {
        console.log('Save Employee: ', user);
        const payload = { ...user }
        dispatch(ShowLoading());
        try {
            let response;
            if (actionType === "add") {
                response = await userService.createEmployee(payload);
            }
            else {
                if (!payload.password) {
                    delete payload.password;
                }
                response = await userService.updateEmployee(editUser._id, payload);
            }
            message.success(response.message);
            onRequestClose();
            await fetchEmployees();
        } catch (error) {
            message.error(error.response.data.error);

        } finally {
            dispatch(HideLoading());
        }
    };

    const onRequestClose = () => {
        setIsOpen(false);
    };

    const handlePageChange = (page) => {
        setPageIndex(page);
    };

    return (
        <div className='employees'>
            <div className='top-bar'>
                <div className='title'>Employees</div>
                <div className='btn-container'>
                    <input type='text' className='search-btn' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <IoSearch size={30} className='search-icon' onClick={handleSearch} />
                    <button className='create-btn' onClick={handleAdd}>Create employee</button>
                </div>
            </div>
            {(data && data.length > 0) ?
                <div>
                    <EmployeesTable data={data} handleEdit={handleEdit} handleDelete={handleDelete} />
                    <PaginationHandler count={paginationConfig.count} totalCount={paginationConfig.totalCount} pageIndex={pageIndex} totalPages={paginationConfig.totalPages} handlePageChange={handlePageChange} />
                </div>
                :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            <CustomModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={"Add/Edit Employee Form"}>
                <UserForm user={editUser} userType="employee" actionType={actionType} handleSave={handleSave} />
            </CustomModal>
        </div>
    )
};

export default Employees;