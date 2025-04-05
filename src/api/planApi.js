import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL

export const getPlans = async (planId = null) => {
    try {
        const url = planId
            ? `${apiUrl}/plan/get-plan/${planId}`
            : `${apiUrl}/plan/get-plan`;

        const response = await axios.get(url, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch plan(s)";
    }
};

export const addPlan = async (planData) => {
    try {
        const { name, price, validity, smsAPIService, whatsappAPIService, smsCount, addMembers, userSMSCount,type } = planData;
        const responce = await axios.post(`${apiUrl}/plan/add-plan`, { name, price, validity, smsAPIService, whatsappAPIService, smsCount, addMembers, userSMSCount ,type}, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || ' Failed to add New Plan.';
    }
}

export const updatePlan = async (planId, planData) => {
    try {
        const { name, price, validity, smsAPIService, whatsappAPIService, smsCount, addMembers, userSMSCount ,type} = planData;
        const responce = await axios.put(`${apiUrl}/plan/update-plan/${planId}`, { name, price, validity, smsAPIService, whatsappAPIService, smsCount, addMembers, userSMSCount,type }, { withCredentials: true });
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || ' Failed to Update Plan.';
    }
}
export const deletePlan = async (planId) => {
    try {
        const responce = await axios.delete(`${apiUrl}/plan/delete-plan/${planId}`, { withCredentials: true })
        return responce.data;
    } catch (error) {
        throw error.response?.data?.message || ' Failed to Delete Plan.';

    }
}






