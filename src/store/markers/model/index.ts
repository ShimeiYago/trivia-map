import { MapFocus } from './../../../types/map-focus';
import { ZOOMS } from './../../../constant/index';
import { MAP_MAX_COORINATE } from 'constant';
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
  initMapFocus: MapFocus;
}

const centerCoord = MAP_MAX_COORINATE / 2;

export const initialState: MarkersState = {
  markers: [],
  fetchingState: 'waiting',
  loadedPages: 0,
  initMapFocus: {
    zoom: ZOOMS.default,
    lat: -centerCoord,
    lng: centerCoord,
  },
};
