import { useQuery } from "@tanstack/react-query"
import { getDistricts, getStates, getTaluksByDistrict } from "../api/addressApi"

export const useStateData = () => {
    return useQuery({
        queryKey: ['state'],
        queryFn: getStates,
        staleTime: 5 * 60 * 1000,
        retry: false,
        useErrorBoundary: false,
    })
};

export const useDistrict = (stateCode) => {
    return useQuery({
        queryKey: ['district',stateCode],
        queryFn: ()=>getDistricts(stateCode),
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