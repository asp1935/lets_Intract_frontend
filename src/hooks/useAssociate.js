import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAssociate, getAssociateRefUsers, getAssociates, registerAssociate, updateAssociate, updateAssoCommission } from "../api/assoicateApi";


// Fetch associate
export const useAssociate = (associateId = null) => {
    return useQuery({
        queryKey: ["associate", associateId],
        queryFn: () => getAssociates(associateId),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};

// Add associate
export const useAddAssociate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (associateData) => registerAssociate(associateData),
        onSuccess: () => {
            queryClient.invalidateQueries(["associate", 'associateRef']); // Refresh after adding
        },
    });
};


export const useUpdateAssociate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ associateId, updatedData }) => updateAssociate(associateId, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries(['associate', 'associateRef']);
        }
    })
}

export const useDeleteAssociate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (associateId) => deleteAssociate(associateId),
        onSuccess: () => {
            queryClient.invalidateQueries(['associate', 'associateRef']);
        }
    })
}


// Fetch associate ref details
export const useAssociateRef = (userType) => {
    return useQuery({
        queryKey: ["associateRef", userType],
        queryFn: () => getAssociateRefUsers(userType),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};


export const useUpdateAssoCommission = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ associateId, commission }) => updateAssoCommission(associateId, commission),
        onSuccess: () => {
            queryClient.invalidateQueries(['associate', 'associateRef']);
        }
    })
}