import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';

export interface MarkerDict {
  [shopId: string]: {
    position: Position;
    title: string;
    thumbnailImgUrl?: string;
  };
}

export interface MarkersState {
  markers: MarkerDict;
  fetchingState: LoadingState;
  errorMsg?: string;
  loadedRecords: number;
  totalRecords?: number;
  deletingState: LoadingState;
}

export const initialState: MarkersState = {
  markers: {},
  fetchingState: 'waiting',
  loadedRecords: 0,
  deletingState: 'waiting',
};
