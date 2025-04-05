import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL

export const getAssociates = async (associateId) => {
    try {
        const url = associateId
            ? `${apiUrl}/associate/get-associate/${associateId}`
            : `${apiUrl}/associate/get-associate`;

        const response = await axios.get(url, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch associate(s)";
    }
};

export const registerAssociate = async (associateData) => {
    try {
        const { name, email, mobile, state, district, taluka, otp } = associateData;

        const responce = await axios.post(`${apiUrl}/associate/add-associate`, { name, email, mobile, state, district, taluka, otp }, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration Failed. Please check Fields';
    }
}

export const updateAssociate = async (associateId, updatedData) => {
    try {
        const { name, email, mobile, state, district, taluka } = updatedData
        const responce = await axios.patch(`${apiUrl}/associate/update-associate/${associateId}`, { name, email, mobile, state, district, taluka }, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Update Details';
    }
}

export const deleteAssociate = async (associateId) => {
    try {
        const responce = await axios.delete(`${apiUrl}/associate/delete-associate/${associateId}`, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to Delete Associate";
    }
}

export const getAssociateRefUsers = async (userType) => {
    try {
        const queryParams = new URLSearchParams();
        if (userType) queryParams.append("userType", userType)
        const responce = await axios.get(`${apiUrl}/associate/get-refferal-details?${queryParams.toString()}`, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to Fetch Details"
    }
}

export const updateAssoCommission = async (associateId = null, commission = 0) => {
    try {
        const url = associateId
            ? `${apiUrl}/associate/update-commission/${associateId}`
            : `${apiUrl}/associate/update-commission/`;
        const responce = await axios.patch(url, { commission }, { withCredentials: true })
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed To Update Commission"
    }
}



