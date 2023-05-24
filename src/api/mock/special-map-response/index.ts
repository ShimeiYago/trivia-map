import { GetSpecialMapResponse } from 'api/special-map-api/get-special-map';
import { GetSpecialMapMarkersResponseWithPagination } from 'api/special-map-api/get-special-map-markers';
import { GetSpecialMapsResponseWithPagination } from 'api/special-map-api/get-special-maps';

export const mockGetSpecialMapResponse: GetSpecialMapResponse = {
  specialMapId: 1,
  title: 'トイレマップ',
  thumbnail: 'https://www.yuu-diaryblog.com/wp-content/uploads/2017/06/disney-wc.jpg',
  isPublic: true,
  description: '定番から穴場まで、ディズニーのトイレマップです。',
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
    totalPages: 2,
    currentPage: 1,
    startIndex: 1,
    endIndex: 1,
    results: [
      {
        lat: 1,
        lng: 1,
        park: 'L',
        image:
          'https://cdn-ak.f.st-hatena.com/images/fotolife/n/nats-co/20160323/20160323164220.jpg',
        description: 'アリスモチーフのトイレです。トランプ模様の扉がかわいい。',
        variant: 'blue',
      },
      {
        lat: 5,
        lng: 5,
        park: 'L',
        image: null,
        description: 'エントランスのトイレならここ。',
        variant: 'blue',
      },
    ],
  };
