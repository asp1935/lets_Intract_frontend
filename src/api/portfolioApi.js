import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL


export const getPortfolio = async (id = null, userId = null, userName = null) => {
    try {
        const queryPrams = new URLSearchParams();
        if (id) queryPrams.append('id', id);
        if (userId) queryPrams.append('userId', userId);
        if (userName) queryPrams.append('userName', userName);

        const responce = await axios.get(`${apiUrl}/portfolio/get-portfolio?${queryPrams}`, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch User Portfolio";
    }
};

export const createPortfolio = async (userData) => {
    try {

        const formData = new FormData();

        formData.append('userId', userData.userId);
        formData.append('name', userData.name);
        formData.append('companyUrl', userData.companyUrl);
        formData.append('ownerName', userData.ownerName);
        formData.append('about', userData.about);
        formData.append('email', userData.email);
        formData.append('mobile', userData.mobile);
        formData.append('socialLinks', JSON.stringify(userData.socialLinks));
        formData.append('address', userData.address);
        formData.append('addressUrl', userData.addressUrl);
        formData.append('theme', userData.theme);
        formData.append('profilePhoto', userData.profilePhoto);

        const responce = await axios.post(`${apiUrl}/portfolio/create-portfolio`, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
        return responce.data;

    } catch (error) {
        throw error.response?.data?.message || 'Failed to Create User Portfolio'
    }
};

export const updatePortfolio = async (portfolioId, updatedData) => {
    try {
        const { userName, name, ownerName, about, email, mobile, address, theme, socialLinks,addressUrl,companyUrl} = updatedData;
        const responce = await axios.patch(`${apiUrl}/portfolio/update-portfolio/${portfolioId}`, { userName, name, ownerName, about, email, mobile, address, theme, socialLinks,addressUrl ,companyUrl}, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to Update Portfolio';
    }
};

export const updateProfilePhoto = async (portfolioId, userId, profilePhoto) => {
    try {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('profilePhoto', profilePhoto);
        const response = await axios.patch(`${apiUrl}/portfolio/update-profilepic/${portfolioId}`, formData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
        return response.data;

    } catch (error) {
        throw error.response?.data?.message || "Failed to Update Profile Photo"
    }
}

export const addServices = async (portfolioId, services) => {
    try {
        const response = await axios.patch(`${apiUrl}/portfolio/add-portfolio-services/${portfolioId}`, { services }, { withCredentials: true })
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Failed to Add Services"
    }
};

export const addClients = async (portfolioId, userId, clients, files) => {
    try {

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('clients', JSON.stringify(clients));
        files.forEach(file => formData.append('images', file));

        const responce = await axios.patch(`${apiUrl}/portfolio/add-portfolio-client/${portfolioId}`, formData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to Add Clients"
    }
};

export const addGallery = async (portfolioId, userId, gallery, files) => {
    try {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('gallery', JSON.stringify(gallery));
        files.forEach(file => formData.append('data', file));

        const responce = await axios.patch(`${apiUrl}/portfolio/add-portfolio-gallery/${portfolioId}`, formData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to Add Gallery Items"
    }
};

export const deletePortfolioItem = async (portfolioId, itemId, type) => {
    try {
        const queryPrams = new URLSearchParams();
        if (portfolioId && itemId && type) {
            queryPrams.append('id', portfolioId);
            queryPrams.append('itemId', itemId);
            queryPrams.append('type', type);

            const responce = await axios.delete(`${apiUrl}/portfolio/delete-portfolio-item?${queryPrams}`, { withCredentials: true })
            return responce.data;
        }
    } catch (error) {
        throw error.response?.data?.message || `Failed to Delete ${type}`;
    }
};

export const deletePortfolio = async (pid) => {
    try {
        const response = await axios.delete(`${apiUrl}/portfolio/delete-portfolio/${pid}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to Delete Portfolio';
    }
};

export const updateIncludeLink = async (pid, includeLink) => {
    try {

        const response = await axios.patch(`${apiUrl}/portfolio/update-include-link/${pid}`, { includeLink }, { withCredentials: true });
        return response.data;
    } catch (error) {

        throw error.response.data.message || "Failed To Update Status";
    }
}

export const upsertPaymentDetails = async (portfolioId, userId, paymentData) => {
    try {
        const formData = new FormData();
        formData.append('userId', userId);
        if (paymentData.qrFile) {
            formData.append('qrFile', paymentData.qrFile);
        }

        formData.append('bankName', paymentData.bankName);
        formData.append('accountHolderName', paymentData.accountHolderName);
        formData.append('accountNo', paymentData.accountNo);
        formData.append('ifscNo', paymentData.ifscNo);
        formData.append('gstinNo', paymentData.gstinNo);


        const response = await axios.patch(`${apiUrl}/portfolio/add-payment/${portfolioId}`, formData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Failed to Upsert Payment Details"
    }
};

export const deletePaymetDetails = async (portdolioId) => {
    try {
        const response = await axios.delete(`${apiUrl}/portfolio/delete-details/${portdolioId}`, { withCredentials: true });
        return response;
    } catch (error) {
        throw error.response?.data?.message || "Failed to Delete Payment Details"

    }

}


