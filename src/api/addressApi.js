import axios from "axios"
const apiUrl = import.meta.env.VITE_LOCATION_API_URL

export const getDistricts = async () => {
    try {
        const response = await axios.post(`${apiUrl}/API/GetAllDistricts`);
        return response.data

    } catch (error) {
        throw error || 'Internal Server Error';
    }
}

export const getTaluksByDistrict = async (distcode) => {
    try {
        const response = await axios.post(`${apiUrl}/API/GetTalukasOfDistrict?distcode=${distcode}`);
        return response.data
    } catch (error) {
        throw error || 'Internal Server Error';

    }
}
