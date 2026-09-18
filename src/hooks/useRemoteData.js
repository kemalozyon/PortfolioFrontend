import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { contentQueryKey } from '../lib/queryClient';

export const useRemoteData = (url, expectArray = false) => {
  const query = useQuery({
    queryKey: contentQueryKey(url),
    queryFn: async ({ signal }) => {
      const { data } = await axios.get(url, { signal, timeout: 15000 });
      if (expectArray ? !Array.isArray(data) : !data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Unexpected API response');
      }
      return data;
    },
  });

  const notFound = query.error?.response?.status === 404;
  const hasData = query.data !== undefined;
  return {
    data: notFound ? null : query.data ?? null,
    loading: !hasData && (query.isPending || query.isFetching),
    // A failed background refresh should not hide previously loaded content.
    error: notFound ? 'not-found' : !hasData && query.isError ? 'unavailable' : null,
    retry: () => query.refetch(),
  };
};
