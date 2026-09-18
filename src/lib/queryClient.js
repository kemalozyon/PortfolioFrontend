import { QueryClient } from '@tanstack/react-query';

export const contentQueryKey = (url) => ['public-content', ...url.split('/').filter(Boolean)];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: false,
    },
  },
});

// List and detail requests share a collection prefix for admin invalidation.
export const invalidateContent = async (collection, deletedId) => {
  const queryKey = contentQueryKey(`/api/${collection}`);
  await queryClient.cancelQueries({ queryKey });
  if (deletedId) {
    queryClient.removeQueries({
      queryKey: contentQueryKey(`/api/${collection}/${deletedId}`),
      exact: true,
    });
  }
  await queryClient.invalidateQueries({ queryKey });
};
