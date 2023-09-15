import { GetSpecialMapResponse } from 'api/special-map-api/get-special-map';
import { GetSpecialMapMarkersResponseWithPagination } from 'api/special-map-api/get-special-map-markers';
import { GetSpecialMapsResponseWithPagination } from 'api/special-map-api/get-special-maps';
import { PostSpecialMapResponse } from 'api/special-map-api/post-special-map';
import { PostSpecialMapMarkerResponse } from 'api/special-map-api/post-special-map-marker';

export const mockGetSpecialMapResponse: GetSpecialMapResponse = {
  specialMapId: 1,
  title: 'トイレマップ',
  thumbnail: 'https://www.yuu-diaryblog.com/wp-content/uploads/2017/06/disney-wc.jpg',
  isPublic: true,
  description: '定番から穴場まで、ディズニーのトイレマップです。',
  selectablePark: 'both',
  author: {
    userId: 1,
    nickname: 'Axel',
    icon: 'https://disneyparkstory.com/wp-content/uploads/2017/09/apple-touch-icon.png',
    url: 'https://disneyparkstory.com',
  },
  minLatitude: -255.0,
  maxLatitude: 0.0,
  minLongitude: 0.0,
  maxLongitude: 255.0,
  createdAt: '2023/1/1 12:00',
};

export const mockGetSpecialMapsResponseWithPagination: GetSpecialMapsResponseWithPagination = {
  nextUrl: null,
  previousUrl: null,
  totalRecords: 2,
  totalPages: 2,
  currentPage: 1,
  startIndex: 1,
  endIndex: 1,
  results: [
    mockGetSpecialMapResponse,
    {
      specialMapId: 2,
      title: '「関係者以外立ち入り禁止」看板マップ',
      thumbnail: null,
      isPublic: true,
      description: 'パーク中の「関係者以外立ち入り禁止」の看板のまとめです。',
    },
  ],
};

export const mockGetSpecialMapMarkersResponseWithPagination: GetSpecialMapMarkersResponseWithPagination =
  {
    nextUrl: null,
    previousUrl: null,
    totalRecords: 2,
    totalPages: 1,
    currentPage: 1,
    startIndex: 1,
    endIndex: 1,
    results: [
      {
        specialMapMarkerId: 1,
        lat: -67.6875,
        lng: 140.75,
        park: 'L',
        image:
          'https://cdn-ak.f.st-hatena.com/images/fotolife/n/nats-co/20160323/20160323164220.jpg',
        description: 'アリスモチーフのトイレです。トランプ模様の扉がかわいい。',
        variant: 'restroom',
      },
      {
        specialMapMarkerId: 2,
        lat: -140.46875,
        lng: 111.0625,
        park: 'S',
        image: null,
        description: 'エントランスのトイレならここ。',
        variant: 'restroom',
      },
    ],
  };

export const mockPostSpecialMapResponse: PostSpecialMapResponse = {
  specialMapId: 1,
  title: '「関係者以外立ち入り禁止」看板マップ',
  description: 'パーク中の「関係者以外立ち入り禁止」の看板のまとめです。',
  selectablePark: 'both',
  isPublic: true,
  thumbnail: null,
  minLatitude: -255,
  maxLatitude: 0,
  minLongitude: 0,
  maxLongitude: 255,
};

export const mockPostSpecialMapMarkerResponse: PostSpecialMapMarkerResponse = {
  specialMapMarkerId: 1,
  specialMap: 1,
  lat: -140.46875,
  lng: 111.0625,
  park: 'L',
  description: 'パーク中の「関係者以外立ち入り禁止」の看板のまとめです。',
  variant: 'restroom',
  image: 'https://cdn-ak.f.st-hatena.com/images/fotolife/n/nats-co/20160323/20160323164220.jpg',
};
