import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL


export const getStates = async () => {
    try {
        const response = await axios.post(`${apiUrl}/address/getAllStates`);
        
        return response.data

    } catch (error) {
        throw error || 'Internal Server Error';
    }
}

export const getDistricts = async (stateCode) => {
    try {
        const response = await axios.post(`${apiUrl}/address/getDistrictByStateCode?statecode=${stateCode}`);
        return response.data

    } catch (error) {
        throw error || 'Internal Server Error';
    }
}

export const getTaluksByDistrict = async (distcode) => {
    try {
        const response = await axios.post(`${apiUrl}/address/getTalukasByDistrictCode?districtcode=${distcode}`);
        return response.data
    } catch (error) {
        throw error || 'Internal Server Error';

    }
}
