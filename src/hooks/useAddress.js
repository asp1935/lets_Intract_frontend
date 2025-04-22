import { useQuery } from "@tanstack/react-query"
import { getDistricts, getTaluksByDistrict } from "../api/addressApi"

export const useDistrict = () => {
    return useQuery({
        queryKey: ['district'],
        queryFn: getDistricts,
        staleTime: 5 * 60 * 1000,
        retry: false,
        useErrorBoundary: false,
    })
};

export const useTaluka = (distcode) => {
    return useQuery({
        queryKey: ['taluka', distcode],
        queryFn: () => getTaluksByDistrict(distcode),
        staleTime: 5 * 60 * 1000,
        retry: false,
        useErrorBoundary: false
    })
}