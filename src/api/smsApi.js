import axios from "axios"

const apiUri = import.meta.env.VITE_API_URL


export const getSmsApi = async () => {
    try {
        const response = await axios.get(`${apiUri}/smsapi/get-smsapi`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Fetch Details';
    }
}

export const upsertSmsApi = async (smsApiData) => {
    try {
        const { apiUrl, apiKey, senderId, channel, dcs } = smsApiData;

        const response = await axios.post(`${apiUri}/smsapi/upsert-smsapi`, { apiUrl, apiKey, senderId, channel, dcs }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Update/Save Data';
    }
}

export const getTemplete = async (templeteName = null) => {
    try {
        const apiUrl = templeteName ? '${apiUri}/templete/get-templete?templeteName=${templeteName}' : `${apiUri}/templete/get-templete`;
        const response = await axios.get(apiUrl, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Fetch Details';
    }
}

export const upsertTemplete = async (templeteData) => {
    try {
        const { templeteName, templete } = templeteData;
        const response = await axios.post(`${apiUri}/templete/upsert-templete`, { templeteName, templete }, { withCredentials: true })
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to Update/Save Templete";
    }
}
