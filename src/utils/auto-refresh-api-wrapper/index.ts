import { refreshToken } from 'api/auths-api/refresh-token';
import { ApiError } from 'api/utils/handle-axios-error';

export async function autoRefreshApiWrapper<Response>(
  api: () => Promise<Response>,
) {
  let apiError: ApiError<unknown>;

  try {
    return await api();
  } catch (error) {
    apiError = error as ApiError<unknown>;

    if (apiError.status !== 401) {
      throw apiError;
    }
  }

  try {
    await refreshToken();
  } catch (error) {
    throw apiError;
  }

  return await api();
}
