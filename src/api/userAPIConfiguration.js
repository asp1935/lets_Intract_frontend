import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL;


export const upsertWhatsappAPI = async (userId, whatsappConfig) => {
    try {
        
        const { apiKey, apiAuthKey, channelNo } = whatsappConfig;
        const responce = await axios.post(`${apiUrl}/whatsappconfig/upsert-config`, { userId, apiKey, apiAuthKey, channelNo }, { withCredentials: true });
        return responce.data
    } catch (error) {
        throw error.response?.data?.message || ' Failed to add/update Whatsapp Configuration';
    }
}

export const getWhatsappAPI = async (userId) => {
    try {
        const response = await axios.get(`${apiUrl}/whatsappconfig/get-config/${userId}`, { withCredentials: true });
        return response.data
    } catch (error) {
        throw error.responce?.data?.message || "Faild to Get API Congiguration"
    }
}

export const upsertSMSAPI = async (userId, smsConfig) => {
    try {
        const { apiKey, senderId, dcs, channelNo } = smsConfig;
        const responce = await axios.post(`${apiUrl}/smsconfig/upsert-config`, { userId, apiKey, senderId, dcs, channelNo }, { withCredentials: true });
        return responce.data
    } catch (error) {
        throw error.response?.data?.message || ' Failed to add/update SMS Configuration';
    }
}

export const getSMSAPI = async (userId) => {
    try {
        const response = await axios.get(`${apiUrl}/smsconfig/get-config/${userId}`, { withCredentials: true });
        return response.data
    } catch (error) {
        throw error.responce?.data?.message || "Faild to Get API Congiguration"
    }
}

export const upsertAPIUrls = async (apiUrls) => {
    try {
        const { whatsappApiUrl, smsApiUrl } = apiUrls;
        const responce = await axios.post(`${apiUrl}/apiUrl/upsert`, { whatsappApiUrl, smsApiUrl }, { withCredentials: true });
        return responce.data
    } catch (error) {
        throw error.response?.data?.message || ' Failed to add/update API URLs';
    }
}

export const getAPI = async () => {
    try {
        const response = await axios.get(`${apiUrl}/apiUrl/get`, { withCredentials: true });
        return response.data
    } catch (error) {
        throw error.responce?.data?.message || "Faild to Get API URL"
    }
}