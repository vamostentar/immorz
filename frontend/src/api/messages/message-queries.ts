import type { Message } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import type { MessageQueryParams, MessageStats } from './types';

/**
 * Fetch messages with optional filters
 */
export function useMessages(params?: Partial<MessageQueryParams>) {
  return useQuery<{ data: Message[]; pagination: any }>({
    queryKey: ['messages', params],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/messages', { params });
      return data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Fetch message statistics
 */
export function useMessageStats(agentId?: string) {
  return useQuery<MessageStats>({
    queryKey: ['messages-stats', agentId],
    queryFn: async () => {
      const params = agentId ? `?agentId=${agentId}` : '';
      const { data } = await api.get(`/api/v1/messages/stats${params}`);
      return data.data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Fetch conversation thread for a message
 */
export function useMessageConversation(messageId: string | null) {
  return useQuery<Message[]>({
    queryKey: ['message-conversation', messageId],
    queryFn: async () => {
      if (!messageId) return [];
      const { data } = await api.get(`/api/v1/messages/${messageId}/conversation`);
      return data.data;
    },
    enabled: !!messageId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Reply to a message
 */
export function useReplyToMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ messageId, body, subject, toEmail, attachments }: { 
      messageId: string; 
      body: string; 
      subject?: string; 
      toEmail?: string;
      attachments?: { name: string; url: string; type: string; size: number }[];
    }) => {
      const { data } = await api.post(`/api/v1/messages/${messageId}/reply`, { body, subject, toEmail, attachments });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages-stats'] });
    },
  });
}

/**
 * Mark a message as read
 */
export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data } = await api.patch(`/api/v1/messages/${messageId}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages-stats'] });
    },
  });
}

/**
 * Mark a message as unread
 */
export function useMarkMessageAsUnread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data } = await api.patch(`/api/v1/messages/${messageId}/unread`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages-stats'] });
    },
  });
}

/**
 * Delete a message (move to trash)
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data } = await api.delete(`/api/v1/messages/${messageId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages-stats'] });
    },
  });
}

/**
 * Restore a message from trash
 */
export function useRestoreMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data } = await api.patch(`/api/v1/messages/${messageId}/restore`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages-stats'] });
    },
  });
}

/**
 * Permanently delete a message
 */
export function usePermanentlyDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data } = await api.delete(`/api/v1/messages/${messageId}/permanent`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages-stats'] });
    },
  });
}


/**
 * Send a new message (outbound)
 */
export function useCreateMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ toEmail, subject, body, attachments }: { 
      toEmail: string; 
      subject: string; 
      body: string; 
      attachments?: { name: string; url: string; type: string; size: number }[];
    }) => {
      const { data } = await api.post('/api/v1/messages/send', { toEmail, subject, body, attachments });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages-stats'] });
    },
  });
}
