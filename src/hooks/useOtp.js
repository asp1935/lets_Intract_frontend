import { useMutation } from "@tanstack/react-query";
import { sendOtp } from "../api/otpApi";

export const useSendOtp = () => {
    return useMutation({
        mutationFn: (mobile) => sendOtp(mobile),
        onSuccess: () => {
            console.log('OTP Sent');
        },
    });
};