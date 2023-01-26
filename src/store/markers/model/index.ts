import { LoadingState } from 'types/loading-state';
import { Marker } from 'types/marker';
import { Park } from './../../../types/park';

export interface MarkersState {
  markers: Marker[];
  focusingPark?: Park;
  filteringCategoryId?: number;
  userId?: number;
  fetchingState: LoadingState;
  loadedPages: number;
  totalPages?: number;
}

export const initialState: MarkersState = {
  markers: [],
  fetchingState: 'waiting',
  loadedPages: 0,
};
