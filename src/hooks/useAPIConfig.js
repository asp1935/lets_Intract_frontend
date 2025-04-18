import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAPI, getSMSAPI, getWhatsappAPI, upsertAPIUrls, upsertSMSAPI, upsertWhatsappAPI } from "../api/userAPIConfiguration";

// Fetch whatsapp config
export const useWhatsappConfig = (userId) => {
    return useQuery({
        queryKey: ["whatsapp", userId],
        queryFn: () => getWhatsappAPI(userId),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        enabled: !!userId,
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
        // refetchOnWindowFocus: false,  // 🔥 Add this to fix re-fetching on tab switch
    });
};

// Add whatsapp config
export const useUpsertWhatsappConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, whatsappConfig }) => upsertWhatsappAPI(userId, whatsappConfig),
        onSuccess: (variables) => {
            queryClient.invalidateQueries(["whatsapp",variables.userId]); // Refresh after adding
        },
    });
};

// Fetch sms config
export const useSmsConfig = (userId) => {
    return useQuery({
        queryKey: ["sms", userId],
        queryFn: () => getSMSAPI(userId),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        enabled: !!userId,
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
    });
};


// Add sms config
export const useUpsertSmsConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, smsConfig }) => upsertSMSAPI(userId, smsConfig),
        onSuccess: () => {
            queryClient.invalidateQueries(["sms"]); // Refresh after adding
        },
    });
};

// Fetch apiurl config
export const useAPIUrlConfig = () => {
    return useQuery({
        queryKey: ["api"],
        queryFn: getAPI,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
    });
};


// Add apiurl config
export const useUpsertAPIUrlConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (apiUrls) => upsertAPIUrls(apiUrls),
        onSuccess: () => {
            queryClient.invalidateQueries(["api"]); // Refresh after adding
        },
    });
};


