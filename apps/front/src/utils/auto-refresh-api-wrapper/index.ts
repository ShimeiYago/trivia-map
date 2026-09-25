import { refreshToken } from 'api/auths-api/refresh-token';
import { ApiError } from 'api/utils/handle-axios-error';

export async function autoRefreshApiWrapper<Response>(
  api: () => Promise<Response>,
  deleteUserInfo: () => void,
) {
  let apiError: ApiError<unknown>;
  let refreshError: ApiError<unknown>;

  try {
    return await api();
  } catch (error) {
    apiError = error as ApiError<unknown>;

    if (apiError.status !== 401) {
      throw apiError;
    }
  }

  // 401 error case
  try {
    await refreshToken();
  } catch (error) {
    refreshError = error as ApiError<unknown>;
    if (refreshError.status === 401) {
      deleteUserInfo();
    }

    throw apiError;
  }

  return await api();
}
