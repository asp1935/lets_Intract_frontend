import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addClients, addGallery, addServices, createPortfolio, deletePaymetDetails, deletePortfolio, deletePortfolioItem, getPortfolio, updateIncludeLink, updatePortfolio, updateProfilePhoto, upsertPaymentDetails } from "../api/portfolioApi";


// Fetch Plans
export const usePortfolio = (id = null, userId = null, userName = null) => {
    return useQuery({
        queryKey: ["portfolio", id, userId, userName],
        queryFn: () => getPortfolio(id, userId, userName),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: false,             // Don't retry on failure
        useErrorBoundary: false,  // Don't throw to error boundaries
    });
};

// createPortfolio
export const useCreatePortfolio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userData) => createPortfolio(userData),
        onSuccess: () => {
            queryClient.invalidateQueries(["portfolio"]); // Refresh after adding
        },
    });
};

//update Portfolio
export const useUpdatePortfolio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ portfolioId, updatedData }) => updatePortfolio(portfolioId, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio'])
        }
    })
}

export const useUpdateProfilePhoto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ portfolioId, userId, profilePhoto }) => updateProfilePhoto(portfolioId, userId, profilePhoto),
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio'])
        }
    })
}

export const useAddServices = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ portfolioId, services }) => addServices(portfolioId, services),
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio'])
        }
    })
}

export const useAddClients = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ portfolioId, userId, clients, files }) => addClients(portfolioId, userId, clients, files),
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio'])
        }
    })
}

export const useAddGallery = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ portfolioId, userId, gallery, files }) => addGallery(portfolioId, userId, gallery, files),
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio'])
        }
    })
}

export const useDeletePortfolioItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ portfolioId, itemId, type }) => deletePortfolioItem(portfolioId, itemId, type),
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio'])
        }
    })
}
export const useDeletePortfolio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (pid) => deletePortfolio(pid),
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio'])
        }
    })
}

export const useUpdateIncludeLink = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ pid, status }) => updateIncludeLink(pid, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio'])
        }
    })
}

export const useUpsertPaymentDetails = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ portfolioId, userId, paymentData }) => upsertPaymentDetails(portfolioId, userId, paymentData),
        onSuccess: () => {
            queryClient.invalidateQueries(['portfolio'])
        }
    })
}

export const useDeletePaymentDetails=()=>{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:({portfolioId})=>deletePaymetDetails(portfolioId),
        onSuccess:()=>{
            queryClient.invalidateQueries(['portfolio'])
        }
    })
}