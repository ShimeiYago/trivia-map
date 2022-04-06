import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';

export type Marker = {
  postId: string;
  position: Position;
  title: string;
};

export interface MarkersState {
  list: Marker[];
  fetchingState: LoadingState;
  errorMsg?: string;
  currentPageToLoad: number;
  totalPages?: number;
}

export const initialState: MarkersState = {
  list: [],
  fetchingState: 'waiting',
  currentPageToLoad: 0,
};
