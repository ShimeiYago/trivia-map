export interface GlobalErrorState {
  status?: ErrorStatus;
}

export const initialState: GlobalErrorState = {
  status: undefined,
};

export type ErrorStatus = 404 | 500;
