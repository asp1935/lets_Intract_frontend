import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { associatePayment, getAssociatePayout, getStaffPayout, staffPayment } from "../api/payoutApi";


// Fetch payout
export const useStaffPayout = () => {
    return useQuery({
        queryKey: ["staffPayout"],
        queryFn: getStaffPayout,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
    });
};

export const useStaffPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ staffId, paymentData }) => staffPayment(staffId, paymentData),
        onSuccess: () => {
            queryClient.invalidateQueries(['staffPayout'])
        }
    })
}

export const useAssociatePayout = () => {
    return useQuery({
        queryKey: ["associatePayout"],
        queryFn: getAssociatePayout,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
    });
};

export const useAssociatePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ associateId, paymentData }) => associatePayment(associateId, paymentData),
        onSuccess: () => {
            queryClient.invalidateQueries(['associatePayout'])
        }
    })
}