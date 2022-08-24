import { LoadingState } from 'types/loading-state';
import { Park } from './../../../types/park';

export interface Marker {
  markerId: number;
  lat: number;
  lng: number;
  park: Park;
  numberOfPublicArticles: number;
}

export interface MarkersState {
  markers: Marker[];
  fetchingState: LoadingState;
  loadedPages: number;
  totalPages?: number;
}

export const initialState: MarkersState = {
  markers: [],
  fetchingState: 'waiting',
  loadedPages: 0,
};
