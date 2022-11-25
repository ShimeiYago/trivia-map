import { Park } from './park';

export type Marker = {
  markerId: number;
  lat: number;
  lng: number;
  park: Park;
  numberOfPublicArticles: {
    total: number;
    breakdown: number[];
  };
};
