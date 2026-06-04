import Cookies from 'js-cookie';
import axios from 'axios';

const getTenantId = async () => {
    const currentHost = window.location.hostname;
    let tenantId = Cookies.get('tenant-id');
    if (!tenantId) {
        console.log('Fetching Tenant Id from admin server...');
        try {
            const response = await axios.get(`${import.meta.env.VITE_ADMIN_BASE_URL}/api/tenant/get-tenant-id-by-host/${currentHost}`);
            if (response.data?.tenantId) {
                Cookies.set('tenant-id', response.data.tenantId);
                tenantId = response.data.tenantId;
            }
        } catch (error) {
            console.log('Unable to fetch tenant id from admin server');
        }
    }
    return tenantId;
};

export { getTenantId };