import {
  QueryClient,
  UndefinedInitialDataOptions,
  useQuery,
} from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';

import { api } from '@/util/dev';

export const queryClient = new QueryClient();

export const useApiQuery = (
  path: string,
  params?: Record<string, unknown> | null,
  opts?: Partial<UndefinedInitialDataOptions>,
) => {
  return useQuery({
    queryKey: [path, params],
    queryFn: async () => {
      const resp = await axios.get(api + path, {
        params: params ?? undefined,
      });
      return resp.data;
    },
    ...opts,
  });
};
