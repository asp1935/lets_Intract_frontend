import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL

export const getEnquiry = async () => {
    try {
        const response = await axios.get(`${apiUrl}/enquiry/get`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Fetch Enquiries';
    }
}

export const updateEnquiryStatus = async (enquiryId, status) => {
    
    try {
        const response = await axios.patch(`${apiUrl}/enquiry/update/${enquiryId}`, { status }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Update Status';
    }
}

export const deleteEnquiry = async (enquiryId) => {
    try {
        const response = await axios.delete(`${apiUrl}/enquiry/delete/${enquiryId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Delete Enquiry';
    }
}
