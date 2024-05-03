'use client';

import { MantineProvider } from '@mantine/core';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/query';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme='dark'>
          {/*  */}
          {children}
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
};
export default Providers;
