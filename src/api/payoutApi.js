import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL


export const getStaffPayout = async () => {
    try {
        const responce = await axios.get(`${apiUrl}/payout/get-staff-payout`, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch Payout Details";
    }
}

export const staffPayment = async (staffId, paymentData) => {
    try {
        const { paymentMode, utr } = paymentData;
        const responce = await axios.post(`${apiUrl}/payout/staff-pay/${staffId}`, { paymentMode, utr }, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Payment Failed";
    }
}

export const genrateSaffPayout = async () => {
    try {
        const responce = await axios.get(`${apiUrl}/payout/genrate-staff-payout`, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Genrate Payout'
    }
}



export const getAssociatePayout = async () => {
    try {
        const responce = await axios.get(`${apiUrl}/payout/get-payout`, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch Payout Details";

    }
}

export const associatePayment = async (associateId, paymentData) => {
    try {
        const { paymentMode, utr } = paymentData;
        const responce = await axios.post(`${apiUrl}/payout/pay/${associateId}`, { paymentMode, utr }, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Payment Failed";
    }
}

export const genrateAssociatePayout = async () => {
    try {
        const responce = await axios.get(`${apiUrl}/payout/genrate-payout`, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Genrate Payout'
    }
}