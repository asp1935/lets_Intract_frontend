import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL

export const getPayoutHistory = async (userType) => {
    try {
        const queryParams = new URLSearchParams();
        if (userType) queryParams.append("userType", userType);
        const responce = await axios.get(`${apiUrl}/history/get-history?${queryParams}`, { withCredentials: true })
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to Fetch History"
    }
}

export const getMonthlyReport = async (selectedMonth) => {
    try {
        const queryParams = new URLSearchParams();
        if (selectedMonth) {
            const month = (new Date(selectedMonth).getMonth() + 1).toString().padStart(2, "0"); // Ensures 01, 02, ..., 12
            const year = new Date(selectedMonth).getFullYear();

            queryParams.append("month", month);
            queryParams.append("year", year);
        }

        const responce = await axios.get(`${apiUrl}/planpurchase/get-monthly-report?${queryParams}`, { withCredentials: true })
        return responce.data;

    } catch (error) {
        throw error.response?.data?.message || "Faild to Get Report"
    }
}