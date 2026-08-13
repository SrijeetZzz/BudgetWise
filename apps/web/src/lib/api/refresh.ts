import { refreshClient } from './refresh-client';
import { authToken } from './auth';
import { API_ENDPOINTS } from './endpoints';

interface RefreshResponse {
  accessToken: string;
}

export async function refreshAccessToken(): Promise<string> {
  const { data } = await refreshClient.post<RefreshResponse>(
    API_ENDPOINTS.AUTH.REFRESH,
    {},
    {
      headers: {
        'x-skip-auth-refresh': 'true',
      },
    },
  );

  authToken.set(data.accessToken);

  return data.accessToken;
}