import { useState, useEffect } from 'react';
import './Plans.css';
import PlanCard from './components/PlanCard/PlanCard';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../../redux/loaderSlice';
import productService from '../../../services/productService';
import stripeService from '../../../services/stripeService';
import subscriptionService from '../../../services/subscriptionService';

const Plans = () => {
    const [products, setProducts] = useState([]);
    const [info, setInfo] = useState({
        status: false,
        planName: '',
        productId: '',
        subscriptionId: '',
        amount: null
    });
    const [oldProductId, setOldProductId] = useState(null);
    const dispatch = useDispatch();

    const getSubscriptionInfo = async () => {
        console.log('Old ID: ', oldProductId);
        try {
            const response = await subscriptionService.getUserSubscriptionInfo();
            if (response.info) {
                console.log('Info: ', response.info);
                setInfo(response.info);
                if (oldProductId && oldProductId === response.info.productId) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    await getSubscriptionInfo();
                }
            }
        } catch (error) {
            message.error(error.response.data.error);
        }
    };

    const fetchProducts = async () => {
        dispatch(ShowLoading());
        try {
            const response = await productService.fetchAllProducts();
            if (response.products) {
                setProducts(response.products);
                await getSubscriptionInfo();
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

    useEffect(() => {
        const updateSubscriptionInfo = async () => {
            if (oldProductId) {
                dispatch(ShowLoading());
                await getSubscriptionInfo();
                dispatch(HideLoading());
            }
        };
        updateSubscriptionInfo();
    }, [oldProductId]);

    const handleContinue = async (priceId) => {
        dispatch(ShowLoading());
        try {
            if (info.status) {
                const response = await stripeService.updateSubscription({ newPriceId: priceId });
                setOldProductId(info.productId);
                console.log('Setting ID...');
                message.success(response.message);
            }
            else {
                const response = await stripeService.createCheckoutSession({ priceId });
                if (response.url) {
                    console.log('URL: ', response.url);
                    window.location.href = response.url;
                }
            }
        } catch (error) {
            message.error(error.response.data.error);
        } finally {
            dispatch(HideLoading());
        }
    };

    return (
        <div className='plans'>
            <div className='main-title'>Plans</div>
            {(products && products.length > 0) &&
                <div className='cards-container'>
                    {products.map((product, index) => (
                        <div key={index}>
                            <>
                                {product.type === 'Subscription' &&
                                    <PlanCard product={product} handleContinue={handleContinue} popular={index === (products.length / 2) - 1} info={info} />
                                }
                            </>
                        </div>
                    ))}
                </div>
            }
        </div >
    )
};

export default Plans;