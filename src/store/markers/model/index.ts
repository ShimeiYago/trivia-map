import { Position } from 'types/position';

export type Marker = {
  postId: string;
  position: Position;
  title: string;
};

export interface MarkersState {
  list: Marker[];
  loading: boolean;
  errorMsg: string | null;
}

export const initialState: MarkersState = {
  list: [],
  loading: false,
  errorMsg: null,
};
