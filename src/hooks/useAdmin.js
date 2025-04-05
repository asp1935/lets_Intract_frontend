import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAdmin, deleteAdmin, getAdmin, updateAdmin } from "../api/adminApi";

// Fetch admin
export const useAdmin = (adminId = null, roleCategory = null) => {
    return useQuery({
        queryKey: ["admin", adminId, roleCategory],
        queryFn: () => getAdmin(adminId, roleCategory),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};


export const useAddAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (adminDetails) => addAdmin(adminDetails),
        onSuccess: () => {
            queryClient.invalidateQueries(["admin"]); // Refresh after adding
        },
    });
}

export const useUpdateAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ adminId, updatedData }) => updateAdmin(adminId, updatedData),
        onSuccess:()=>{
            queryClient.invalidateQueries(['admin']);
        }
    })
}

export const useDeleteAdmin=()=>{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:(adminId)=>deleteAdmin(adminId),
        onSuccess:()=>{
            queryClient.invalidateQueries(['admin']);
        }
    })
}