import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL

export const getStaffRefDetails = async (userType) => {
    try {
        const queryParams = new URLSearchParams();
        if (userType) queryParams.append("userType", userType)
        const responce = await axios.get(`${apiUrl}/referral/get-refferal-details?${queryParams.toString()}`, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to Fetch Details"
    }
}

export const getStaffDetails = async (staffId) => {
    try {
        const url = staffId
            ? `${apiUrl}/referral/get-staff-details/${staffId}`
            : `${apiUrl}/referral/get-staff-details`;

        const response = await axios.get(url, { withCredentials: true });
        return response.data;

    } catch (error) {
        throw error.response?.data?.message || "Failed to Fetch Details"

    }
}

export const updateStaffIncentive = async (staffId = null, incentive = 0) => {
    try {
        const url = staffId
            ? `${apiUrl}/referral/update-incentive/${staffId}`
            : `${apiUrl}/referral/update-incentive/`;
        const responce = await axios.patch(url, { incentive }, { withCredentials: true })
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed To Update incentive"
    }
}

export const getReferralCount = async (id = null, referby = "staff") => {
    try {
        const queryParams = new URLSearchParams();
        if (id) queryParams.append('id', id);
        if (referby) queryParams.append('referby', referby);
        const responce = await axios.get(`${apiUrl}/referral/get-referral-count?${queryParams}`, { withCredentials: true })
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to Fetch Count"

    }
}