import { Park } from './park';

export type MarkerPosition = {
  markerId: number;
  lat: number;
  lng: number;
  park: Park;
  numberOfPublicArticles?: number;
};
