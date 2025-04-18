import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addUserSmsTemplete, addUserWhatsappTemplete, getUserSmsTemplete, getUserWhatsappTemplete } from "../api/messageTempleteApi";


// Fetch user whatsapp templete
export const useWhatsappTemplete = (userId) => {

    return useQuery({
        queryKey: ["whatsappTemplete", userId],
        queryFn: () => getUserWhatsappTemplete(userId),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
    });
};

// Add whatsapp templete
export const useAddWhatsappTemplete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, templeteData }) => addUserWhatsappTemplete(userId, templeteData),
        onSuccess: () => {
            queryClient.invalidateQueries(["whatsappTemplete"]); // Refresh after adding
        },
    });
};
// Fetch user sms templete
export const useSMSTemplete = (userId) => {

    return useQuery({
        queryKey: ["smsTemplete", userId],
        queryFn: () => getUserSmsTemplete(userId),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
    });
};

// Add whatsapp templete
export const useAddSmsTemplete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, templeteData }) => addUserSmsTemplete(userId, templeteData),
        
        onSuccess: () => {
            queryClient.invalidateQueries(["smsTemplete"]); // Refresh after adding
        },
    });
};



