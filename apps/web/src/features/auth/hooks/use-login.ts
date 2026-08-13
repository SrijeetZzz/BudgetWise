
// import { useMutation } from '@tanstack/react-query';
// import { toast } from 'sonner';

// import { authApi } from '../api/auth.api';

// import { authToken } from '@/lib/api/auth';
// import { useAuthStore } from '@/store/auth.store';

// export function useLogin() {
//   const login = useAuthStore((state) => state.login);

//   return useMutation({
//     mutationKey: ['auth', 'login'],

//     mutationFn: authApi.login,

//     onSuccess: (response) => {
//       const { user, accessToken } = response.data;

//       authToken.set(accessToken);

//       login(user, accessToken);

//       toast.success(response.message);
//     },

//     onError: (error: any) => {
//       toast.error(
//         error?.response?.data?.message ??
//           'Unable to login. Please try again.'
//       );
//     },
//   });
// }


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { authApi } from '../api/auth.api';

import { authToken } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth.store';

export function useLogin() {
  const queryClient = useQueryClient();

  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationKey: ['auth', 'login'],

    mutationFn: authApi.login,

    onSuccess: async (response) => {
      const { user, accessToken } = response.data;

      authToken.set(accessToken);

      login(user, accessToken);

      await queryClient.invalidateQueries({
        queryKey: ['auth', 'me'],
      });

      toast.success(response.message);
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message ??
          'Unable to login. Please try again.',
      );
    },
  });
}