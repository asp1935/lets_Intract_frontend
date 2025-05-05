import { useMutation, useQuery } from "@tanstack/react-query";
import { getOpts, sendOtp } from "../api/otpApi";

export const useOtp = () => {
    return useQuery({
        queryKey: ['getotp'],
        queryFn: getOpts,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
        // useErrorBoundary: false,  // Don't throw to error boundaries
    })
}

export const useSendOtp = () => {
    return useMutation({
        mutationFn: (mobile) => sendOtp(mobile),
        onSuccess: (data) => {
            console.log('OTP Sent', data?.data?.otp);
        },
    });
};