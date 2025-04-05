import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL

export const getUserSmsTemplete = async (userId) => {
    try {
        const response = await axios.get(`${apiUrl}/smstemplete/get-user-templete/${userId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Fetch Templetes';
    }
}

export const addUserSmsTemplete = async (userId, templeteData) => {
    try {
        console.log(userId, templeteData);
        const { templeteName, message } = templeteData;

        const response = await axios.post(`${apiUrl}/smstemplete/add-templete`, { userId, templeteName, message }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Add Templete';
    }
}

export const getUserWhatsappTemplete = async (userId) => {
    try {
        const response = await axios.get(`${apiUrl}/whatsapptemplete/get-user-templete/${userId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Fetch Templetes';
    }
}

export const addUserWhatsappTemplete = async (userId, templeteData) => {
    try {
        const { templeteName, message, whatsappImg } = templeteData;


        // Create FormData object
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('templeteName', templeteName);
        formData.append('message', message);
        if (whatsappImg) {
            formData.append('whatsappImg', whatsappImg); // Only append if image exists
        }



        const response = await axios.post(`${apiUrl}/whatsapptemplete/add-templete`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },

        });

        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Add Template';
    }
};

