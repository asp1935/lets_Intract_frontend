import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL

export const sendOtp = async (mobile) => {
    try {
        const response = await axios.post(`${apiUrl}/otp/send-otp`, { mobile }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Send OTP';
    }
};

export const getOpts = async () => {
    try {
        const response = await axios.get(`${apiUrl}/otp/get-otps`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Faild to Fetch OPTs";
    }
}