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
        formData.append('ownerName', userData.ownerName);
        formData.append('about', userData.about);
        formData.append('email', userData.email);
        formData.append('mobile', userData.mobile);
        formData.append('address', userData.address);
        formData.append('theme', userData.theme);
        formData.append('profilePhoto', userData.profilePhoto);

        const responce = await axios.post(`${apiUrl}/portfolio/create-portfolio`,  formData , { withCredentials: true,headers:{"Content-Type":"multipart/form-data"} });
        return responce.data;

    } catch (error) {
        throw error.response?.data?.message || 'Failed to Create User Portfolio'
    }
};

export const updatePortfolio = async (portfolioId, updatedData) => {
    try {
        const { userName, name, ownerName, about, email, mobile, address, theme } = updatedData;
        const responce = await axios.patch(`${apiUrl}/portfolio/update-portfolio/${portfolioId}`, { userName, name, ownerName, about, email, mobile, address, theme }, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to Update Portfolio';
    }
};

export const addServices = async (portfolioId, userId, services) => {
    try {
        const response = await axios.patch(`${apiUrl}/portfolio/add-portfolio-services/${portfolioId}`, { userId, services }, { withCredentials: true })
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Failed to Add Services"
    }
}

export const addClients = async (portfolioId, userId, clients, files) => {
    try {
        const formData = new formData();
        formData.append('userId', userId);
        formData.append('clients'.JSON.stringfy(clients));
        files.map(file => formData.append('images', file));

        const responce = await axios.patch(`${apiUrl}/portfolio/add-portfolio-client/${portfolioId}`, { formData }, { withCredentials: true })
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Faild to Add Clients"
    }
}

export const addGallery = async (portfolioId, userId, gallery, files) => {
    try {
        const formData = new formData();
        formData.append('userId', userId);
        formData.append('gallery'.JSON.stringfy(gallery));
        files.map(file => formData.append('data', file));

        const responce = await axios.patch(`${apiUrl}/portfolio/add-portfolio-client/${portfolioId}`, { formData }, { withCredentials: true })
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to Add Gallery Items"
    }
}

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
}

