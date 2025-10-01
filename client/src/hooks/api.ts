import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  authApi, userApi, auctionApi, bidApi, 
  facebookGroupApi, liveFeedApi 
} from "@/lib/api";

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};

// User hooks
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
  });
};

export const useDashboardStats = (userId: string) => {
  return useQuery({
    queryKey: ["dashboard-stats", userId],
    queryFn: () => userApi.getDashboardStats(userId),
    enabled: !!userId,
    // Removed refetchInterval - using WebSocket for real-time updates
  });
};

export const useUserBids = (userId: string) => {
  return useQuery({
    queryKey: ["user-bids", userId],
    queryFn: () => userApi.getBids(userId),
    enabled: !!userId,
  });
};

export const useUserSettings = (userId: string) => {
  return useQuery({
    queryKey: ["user-settings", userId],
    queryFn: () => userApi.getSettings(userId),
    enabled: !!userId,
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, settings }: { userId: string; settings: any }) =>
      userApi.updateSettings(userId, settings),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user-settings", userId] });
    },
  });
};

// Auction hooks
export const useAuctions = (filters?: { userId?: string; status?: string; limit?: number }) => {
  return useQuery({
    queryKey: ["auctions", filters],
    queryFn: () => auctionApi.getAuctions(filters),
    // Removed refetchInterval - using WebSocket for real-time updates
  });
};

export const useAuction = (id: string) => {
  return useQuery({
    queryKey: ["auction", id],
    queryFn: () => auctionApi.getAuction(id),
    enabled: !!id,
    // Removed refetchInterval - using WebSocket for real-time updates
  });
};

export const useCreateAuction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: auctionApi.createAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
    },
  });
};

export const useUpdateAuction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      auctionApi.updateAuction(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
    },
  });
};

export const useDeleteAuction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: auctionApi.deleteAuction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
    },
  });
};

export const useAuctionBids = (auctionId: string) => {
  return useQuery({
    queryKey: ["auction-bids", auctionId],
    queryFn: () => auctionApi.getBids(auctionId),
    enabled: !!auctionId,
    // Removed refetchInterval - using WebSocket for real-time updates
  });
};

// Bid hooks
export const useCreateBid = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bidApi.createBid,
    onSuccess: (_, variables) => {
      // Invalidate auction data to refresh current bid
      queryClient.invalidateQueries({ queryKey: ["auction", variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ["auction-bids", variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: ["user-bids", variables.userId] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats", variables.userId] });
      }
    },
  });
};

// Facebook Group hooks
export const useUserFacebookGroups = (userId: string) => {
  return useQuery({
    queryKey: ["facebook-groups", userId],
    queryFn: () => facebookGroupApi.getUserGroups(userId),
    enabled: !!userId,
  });
};

export const useCreateFacebookGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: facebookGroupApi.createGroup,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["facebook-groups", variables.userId] });
    },
  });
};

// Live Feed hooks
export const useLiveFeedSessions = (userId: string) => {
  return useQuery({
    queryKey: ["live-feed-sessions", userId],
    queryFn: () => liveFeedApi.getSessions(userId),
    enabled: !!userId,
  });
};

export const useLiveFeedSession = (id: string) => {
  return useQuery({
    queryKey: ["live-feed-session", id],
    queryFn: () => liveFeedApi.getSession(id),
    enabled: !!id,
    // Removed refetchInterval - using WebSocket for real-time updates
  });
};

export const useCreateLiveFeedSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: liveFeedApi.createSession,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["live-feed-sessions", variables.userId] });
    },
  });
};

export const useUpdateLiveFeedSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      liveFeedApi.updateSession(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["live-feed-session", id] });
    },
  });
};

export const useLiveFeedItems = (sessionId: string) => {
  return useQuery({
    queryKey: ["live-feed-items", sessionId],
    queryFn: () => liveFeedApi.getItems(sessionId),
    enabled: !!sessionId,
  });
};

export const useCreateLiveFeedItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: liveFeedApi.createItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["live-feed-items", variables.sessionId] });
    },
  });
};

export const useUpdateLiveFeedItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      liveFeedApi.updateItem(id, updates),
    onSuccess: (_, { updates }) => {
      if (updates.sessionId) {
        queryClient.invalidateQueries({ queryKey: ["live-feed-items", updates.sessionId] });
      }
    },
  });
};
