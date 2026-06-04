import { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, actionType, handleSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        productId: "",
        description: "",
        image: "",
        price: "",
        currency: "",
        type: ""
    });
    const [error, setError] = useState({
        productId: "",
    });

    useEffect(() => {
        if (product && actionType === "edit") {
            const updatedFormData = {
                name: product.name || "",
                productId: product.productId || "",
                description: product.description || "",
                image: product.image || "",
                price: product.price || "",
                currency: product.currency || "",
                type: product.type || ""
            };
            setFormData(updatedFormData);
        }
    }, [product]);

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setFormData({ ...formData, [name]: value });
    };

    const validateProduct = () => {
        let newError = { ...error };
        let errors = false;
        const { productId } = formData;
        if (!productId) {
            newError.productId = 'Product ID is required!';
            errors = true;
        }
        else {
            newError.productId = '';
        }
        setError(newError);
        if (errors) {
            console.log('Error: ', newError);
            return false;
        }
        return true;
    };

    const handleContinue = () => {
        if (!validateProduct()) {
            return;
        }
        handleSave({ productId: formData.productId });
    };

    const checkChanges = () => {
        if(!product || actionType === 'add') {
            return true;
        }
        return formData.productId !== product.productId;
    };

    return (
        <div className='product-form'>
            <div className='input-form'>
                <div className='title'>Stripe Info</div>
                <div className='input-container'>
                    <div className='input-wrapper'>
                        <label htmlFor='productId' className='label'>Product ID</label>
                        <input
                            type='text'
                            name='productId'
                            id='productId'
                            className={`input ${error.productId ? 'input-error' : ''}`}
                            value={formData.productId}
                            onChange={handleChange}
                        />
                    </div>
                    {error.productId && <div className='error'>{error.productId}</div>}
                </div>
                <button className='save-btn' disabled={!checkChanges()} onClick={handleContinue}>Save</button>
            </div>
            {(product && actionType === 'edit') &&
                <div className='input-form'>
                    <div className='title'>Details</div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='name' className='label'>Name</label>
                            <input
                                type='text'
                                name='name'
                                id='name'
                                className={`input`}
                                disabled
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='description' className='label'>Description</label>
                            <textarea
                                rows={5}
                                name='description'
                                id='description'
                                className={`input`}
                                disabled
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='price' className='label'>Price</label>
                            <input
                                type='text'
                                name='price'
                                id='price'
                                className={`input`}
                                disabled
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='currency' className='label'>Currency</label>
                            <input
                                type='text'
                                name='currency'
                                id='currency'
                                className={`input`}
                                disabled
                                value={formData.currency}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='input-container'>
                        <div className='input-wrapper'>
                            <label htmlFor='type' className='label'>Type</label>
                            <input
                                type='text'
                                name='type'
                                id='type'
                                className={`input`}
                                disabled
                                value={formData.type}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
};

export default ProductForm;