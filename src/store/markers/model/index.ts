import { Position } from 'types/position';

export type Marker = {
  postId: string;
  position: Position;
  title: string;
};

export interface MarkersState {
  list: Marker[];
  loading: boolean; // TODO: should use Status
  errorMsg: string | null;
  currentPageToLoad: number;
  totalPages?: number;
}

export const initialState: MarkersState = {
  list: [],
  loading: false,
  errorMsg: null,
  currentPageToLoad: 0,
};
