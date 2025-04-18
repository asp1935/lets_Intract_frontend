import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getReferralCount, getStaffDetails, getStaffRefDetails, updateStaffIncentive } from "../api/staffRefApi";


// Fetch associate
export const useStaffRef = (userType) => {
    return useQuery({
        queryKey: ["staffRef", userType],
        queryFn: () => getStaffRefDetails(userType),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
    });
};

export const useStaff = (staffId = null) => {
    return useQuery({
        queryKey: ['staffDetails', staffId],
        queryFn: () => getStaffDetails(staffId),
        staleTime: 5 * 60 * 1000,//cache for 5min 
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
    })
}

export const useUpdateStaffIncentive = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ staffId, incentive }) => updateStaffIncentive(staffId, incentive),
        onSuccess: () => {
            queryClient.invalidateQueries(['staffDetails', 'staffRef']);
        }
    })
}

export const useGetRefCount = (id = null, referby = 'staff') => {
    return useQuery({
        queryKey: ['refCount', id, referby],
        queryFn: () => getReferralCount(id, referby),
        staleTime: 5 * 60 * 1000,
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
    })
}