import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addUser, deleteUser, getUser, getUserPlan, resetUserKey, updatePassword, updateUser, updateUserPlan, updateVerification } from "../api/userApi";


// Fetch user
export const useUser = (userId = null, role = null, type = null) => {
    return useQuery({
        queryKey: ["user", userId, role, type],
        queryFn: () => getUser(userId, role, type),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
    });
};

// Add user
export const useAddUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userData, referBy, referId }) => addUser(userData, referBy, referId),
        onSuccess: () => {
            queryClient.invalidateQueries(["user"]); // Refresh after adding
        },
    });
};

//update user
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, updatedData }) => updateUser(userId, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries(['user']);
        }
    })
}

//delete user

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId) => deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(['user'])
        }
    })
}

//update password

export const useUpdateUserPassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, newPassword }) => updatePassword(userId, newPassword),
        onSuccess: () => {
            queryClient.invalidateQueries(['user'])
        }
    })
}

//reset userKey

export const useResetUserKey = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId) => resetUserKey(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(['user'])
        }
    })
}
//update verification status

export const useUpdateVerfication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, status }) => updateVerification(userId, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['user'])
        }
    })
}

//

export const useUserPlan = (userId = null) => {
    return useQuery({
        queryKey: ["userplan", userId],
        queryFn: () => getUserPlan(userId),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries    
    });
}

//set-update user-plan
export const useUpsertUserPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ planId, userId }) => updateUserPlan(planId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries(['userplan'])
        }
    })
}