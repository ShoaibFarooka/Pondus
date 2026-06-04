import { useState, useEffect } from 'react';
import './Products.css';
import { message, Empty } from 'antd';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../../redux/loaderSlice';
import ProductsTable from './components/ProductsTable/ProductsTable';
import CustomModal from '../../../components/CustomModal/CustomModal';
import ProductForm from './components/ProductForm/ProductForm';
import productService from '../../../services/productService';

const Products = () => {
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const dispatch = useDispatch();

    const fetchProducts = async () => {
        dispatch(ShowLoading());
        try {
            const response = await productService.fetchAllProducts();
            if (response.products) {
                const filteredProducts = response.products.filter(product => product.type === 'Subscription');
                setData(filteredProducts);
            }
        } catch (error) {
            message.error(error.response.data.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAdd = () => {
        setActionType("add");
        setEditProduct(null);
        setIsOpen(true);
    };

    const handleEdit = (product) => {
        setActionType("edit");
        setEditProduct(product);
        setIsOpen(true);
    };

    const onRequestClose = () => {
        setIsOpen(false);
    };

    const handleDelete = async (product) => {
        const isConfirm = window.confirm('Are you sure?');
        if (!isConfirm) {
            return;
        }
        console.log('Deleting');
        dispatch(ShowLoading());
        try {
            const response = await productService.deleteProduct(product._id);
            message.success(response.message);
            await fetchProducts();
        } catch (error) {
            message.error(error.response.data.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    const handleSave = async (product) => {
        console.log('Save Product: ', product);
        dispatch(ShowLoading());
        try {
            let response;
            if (actionType === "add") {
                response = await productService.addProduct(product);
            }
            else {
                response = await productService.updateProduct(editProduct._id, product);
            }
            message.success(response.message);
            onRequestClose();
            await fetchProducts();
        } catch (error) {
            message.error(error.response.data.error);

        } finally {
            dispatch(HideLoading());
        }
    };

    return (
        <div className='products'>
            <div className='top-bar'>
                <div className='title'>Products</div>
                <div className='btn-container'>
                    <button className='create-btn' onClick={handleAdd}>Create product</button>
                </div>
            </div>
            {(data && data.length) > 0 ?
                <ProductsTable data={data} handleEdit={handleEdit} handleDelete={handleDelete} />
                :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            <CustomModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel={"Add/Edit Product Form"} width={actionType === 'add' ? '40%' : '60%'}>
                <ProductForm product={editProduct} actionType={actionType} handleSave={handleSave} />
            </CustomModal>

        </div>
    )
};

export default Products;