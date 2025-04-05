import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPlan, deletePlan, getPlans, updatePlan } from "../api/planApi";


// Fetch Plans
export const usePlan = (planId = null) => {
    return useQuery({
        queryKey: ["plan", planId],
        queryFn: () => getPlans(planId),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};

// Add plan
export const useAddPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (planData) => addPlan(planData),
        onSuccess: () => {
            queryClient.invalidateQueries(["plan"]); // Refresh after adding
        },
    });
};

// update plan
export const useUpdatePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ planId, planData }) => updatePlan(planId, planData),
        onSuccess: () => {
            queryClient.invalidateQueries(["plan"]); // Refresh after adding
        },
    });
};

// delete plan
export const useDeletePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (planId) => deletePlan(planId),
        onSuccess: () => {
            queryClient.invalidateQueries(["plan"]); // Refresh after adding
        },
    });
};

