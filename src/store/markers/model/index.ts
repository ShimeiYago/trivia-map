import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';

// export type Marker = {
//   postId: string;
//   position: Position;
//   title: string;
// };
export interface MarkerDict {
  [shopId: string]: {
    position: Position;
    title: string;
  };
}

export interface MarkersState {
  markers: MarkerDict;
  fetchingState: LoadingState;
  errorMsg?: string;
  currentPageToLoad: number;
  totalPages?: number;
}

export const initialState: MarkersState = {
  markers: {},
  fetchingState: 'waiting',
  currentPageToLoad: 0,
};
