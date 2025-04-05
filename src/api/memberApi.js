import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL

export const getUserMembers = async (userId) => {
    try {
        const response = await axios.get(`${apiUrl}/user/get-user-members/${userId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Fetch Details';
    }
}

export const addMember = async (userId, memberData) => {
    try {
        const { name, mobile, password, otp } = memberData;
        const response = await axios.post(`${apiUrl}/user/add-member/${userId}`, { name, mobile, password, otp }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Add Member';
    }
}

export const updateMember = async (memberId, memberData) => {
    try {
        const { name, mobile } = memberData;
        const response = await axios.patch(`${apiUrl}/user/update-member/${memberId}`, { name, mobile }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Update Member';
    }
}


// export const deteteMember = async (memberId) => {
//     try {
//         const response = await axios.patch(`${apiUrl}/user/delete-user/${memberId}`, { name, mobile }, { withCredentials: true });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data?.message || 'Failed To Update Member';
//     }
// }