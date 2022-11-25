import { INITIAL_PARK } from 'constant';
import { LoadingState } from 'types/loading-state';
import { Marker } from 'types/marker';
import { Park } from './../../../types/park';

export interface MarkersState {
  markers: Marker[];
  focusingPark: Park;
  filteringCategoryId?: number;
  fetchingState: LoadingState;
  loadedPages: number;
  totalPages?: number;
}

export const initialState: MarkersState = {
  markers: [],
  focusingPark: INITIAL_PARK,
  fetchingState: 'waiting',
  loadedPages: 0,
};
