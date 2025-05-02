import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSmsApi, getTemplete, upsertSmsApi, upsertTemplete } from "../api/smsApi";

// Fetch payout
export const useSmsApi = () => {
    return useQuery({
        queryKey: ['smsapi'],
        queryFn: getSmsApi,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
        // useErrorBoundary: false,  // Don't throw to error boundaries
    });
};

export const useUpsertSmsApi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (smsApiData) => upsertSmsApi(smsApiData),
        onSuccess: () => {
            queryClient.invalidateQueries(["smsapi"]); // Refresh after adding
        },
    });
};

export const useTemplete = (templeteName) => {
    return useQuery({
        queryKey: ['templete', templeteName],
        queryFn: () => getTemplete(templeteName),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
    })
}
export const useUpsertTemplete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (templeteData) => upsertTemplete(templeteData),
        onSuccess: () => {
            queryClient.invalidateQueries(['templete'])
        }
    })
}