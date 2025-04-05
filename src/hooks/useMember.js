import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMember, getUserMembers, updateMember } from "../api/memberApi";


// Fetch member
export const useMember = (userId) => {

    return useQuery({
        queryKey: ["member", userId],
        queryFn: () => getUserMembers(userId),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};

// Add member
export const useAddMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, memberData }) => addMember(userId, memberData),
        onSuccess: () => {
            queryClient.invalidateQueries(["member"]); // Refresh after adding
        },
    });
};

export const useUpdateMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ memberId, memberData }) => updateMember(memberId, memberData),
        onSuccess: () => {
            queryClient.invalidateQueries(["member"]); // Refresh after adding
        },
    });
}


