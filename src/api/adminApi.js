/* eslint-disable no-unused-vars */
import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL

export const login = async (email, password) => {
    try {
        const responce = await axios.post(`${apiUrl}/admin/login-admin`, { email, password }, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed. Please check your credentials.';
    }
}

export const getloggedInUser = async () => {
    try {
        const responce = await axios.get(`${apiUrl}/admin/current-user`, { withCredentials: true });
        return responce.data
    } catch (err) {
        throw 'Session Expired!!! Please Login Again...';
    }
}

export const addAdmin = async (adminDetails) => {
    try {
        console.log(adminDetails);

        const { name, email, role, permissions, password } = adminDetails;
        const response = await axios.post(`${apiUrl}/admin/create-useradmin`, { name, email, role, permissions, password }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed.';
    }
}

export const getAdmin = async (adminId = null, roleCategory = null) => {
    try {
        let url = `${apiUrl}/admin/get-user`;

        if (adminId) {
            url += `/${adminId}`;
        } else if (roleCategory) {
            url += `?roleCategory=${roleCategory}`;
        }

        const response = await axios.get(url, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Something Went Wrong';
    }
}

export const updateAdmin = async (adminId, updatedData) => {
    try {
        const { name, email, permissions } = updatedData
        const responce = await axios.patch(`${apiUrl}/admin/update-admin/${adminId}`, { name, email, permissions }, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed To Update Details';
    }
}

export const deleteAdmin = async (adminId) => {
    try {
        const responce = await axios.delete(`${apiUrl}/admin/delete-admin/${adminId}`, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to Delete ";
    }
}