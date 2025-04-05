import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addClients, addServices, createPortfolio, deletePortfolioItem, getPortfolio, updatePortfolio } from "../api/portfolioApi";


// Fetch Plans
export const usePortfolio = (id = null, userId = null, userName = null) => {
    return useQuery({
        queryKey: ["portfolio", id, userId, userName],
        queryFn: () => getPortfolio(id, userId, userName),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
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

export const useAddServices = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ portfolioId, userId, services }) => addServices(portfolioId, userId, services),
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
        mutationFn: ({ portfolioId, userId, gallery, files }) => addClients(portfolioId, userId, gallery, files),
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