import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteEnquiry, getEnquiry, updateEnquiryStatus } from "../api/enquiryApi";


// Fetch enquiry
export const useEnquiry = () => {
    return useQuery({
        queryKey: ["enquiry"],
        queryFn: getEnquiry,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};


export const useUpdateEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ enquiryId, status }) => updateEnquiryStatus(enquiryId, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['enquiry']);
        }
    })
}

export const useDeleteEnquiry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (enquiryId) => deleteEnquiry(enquiryId),
        onSuccess: () => {
            queryClient.invalidateQueries(['enquiry']);
        }
    })
}
