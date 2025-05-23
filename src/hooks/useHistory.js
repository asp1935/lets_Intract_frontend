import { useQuery } from "@tanstack/react-query";
import { getPayoutHistory } from "../api/historyApi";


export const useHistory = (userType) => {
    return useQuery({
        queryKey: ["history", userType],
        queryFn: () => getPayoutHistory(userType),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
    });
};

