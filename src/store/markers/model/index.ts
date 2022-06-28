import { LoadingState } from 'types/loading-state';

export interface Marker {
  markerId: number;
  lat: number;
  lng: number;
  park: 'L' | 'S';
  numberOfPublicArticles: number;
}

export interface MarkersState {
  markers: Marker[];
  fetchingState: LoadingState;
  errorMsg?: string;
  loadedPages: number;
  totalPages?: number;
}

export const initialState: MarkersState = {
  markers: [],
  fetchingState: 'waiting',
  loadedPages: 0,
};
