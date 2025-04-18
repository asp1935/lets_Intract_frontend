import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL;

export const getUser = async (userId = null, role = null, type = null) => {
    try {
        // Build query parameters for role and type
        const queryParams = new URLSearchParams();
        if (role) queryParams.append("role", role);
        if (type) queryParams.append("type", type);

        // Construct the URL with optional userId and query parameters
        const url = userId
            ? `${apiUrl}/user/get-user-details/${userId}`
            : `${apiUrl}/user/get-user-details?${queryParams.toString()}`;

        // Make the API request
        const response = await axios.get(url, { withCredentials: true });

        // Return response data
        return response.data;
    } catch (error) {
        // Handle errors and return appropriate message
        throw error.response?.data?.message || 'Something Went Wrong';
    }
};


export const addUser = async (userData, referBy = null, referId = null) => {
    try {
        const { name, email, mobile, state, district, taluka, type, password, otp } = userData;

        // Step 1: Add user
        const response = await axios.post(
            `${apiUrl}/user/register-user`,
            { name, email, mobile, state, district, taluka, type, password, otp },
            { withCredentials: true }
        );

        const userId = response.data.data._id;

        // Step 2: Call referral API if referredBy is present
        if (referBy) {
            const referralEndpoint = referBy === 'staff' ? '/add-staff' : '/add';
            try {
                await axios.post(
                    `${apiUrl}/referral${referralEndpoint}`,
                    { userId, id: referId },
                    { withCredentials: true }
                );
            } catch (referralError) {
                // If referral fails, delete the user
                await axios.delete(`${apiUrl}/user/delete-user/${userId}`, { withCredentials: true });
                throw referralError.response?.data?.message || 'Referral Failed. User removed.';
            }
        }

        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration Failed. Please check Fields';
    }
};

export const updateUser = async (userId, updatedData) => {

    try {
        const { name, email, mobile, state, district, taluka, type } = updatedData
        const response = await axios.patch(`${apiUrl}/user/update-user/${userId}`, { name, email, mobile, state, district, taluka, type }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Update Details';
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${apiUrl}/user/delete-user/${userId}`, { withCredentials: true })
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Faild To Delete";
    }
};

export const updatePassword = async (userId, newPassword) => {
    try {
        const response = await axios.patch(`${apiUrl}/user/update-password/${userId}`, { newPassword }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Faild to Update Password";
    }
}

export const resetUserKey = async (userId) => {
    try {
        const response = await axios.patch(`${apiUrl}/user/delete-userkey/${userId}`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed To Reset Key";
    }
}

//update verification status
export const updateVerification = async (userId, verified) => {
    try {
        const response = await axios.patch(`${apiUrl}/user/update-verification/${userId}`, { verified }, { withCredentials: true });
        return response.data;
    } catch (error) {

        throw error.response.data.message || "Failed To Update Verifiaction";
    }
}


//get user plan details
export const getUserPlan = async (userId = null) => {
    try {
        const url = userId
            ? `${apiUrl}/userplan/get-userPlan-details/${userId}`
            : `${apiUrl}/userplan/get-userPlan-details/`;
        const responce = await axios.get(url, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response.data.message || "Failed To Fetch Details";

    }
}

//upsert user plan
export const updateUserPlan = async (planId, userId) => {
    try {
        const responce = await axios.post(`${apiUrl}/userplan/update-plan`, { planId, userId }, { withCredentials: true })
        return responce.data
    } catch (error) {
        throw error.response?.data?.message || ' Failed to Add User Plan.';
    }
}