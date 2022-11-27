import { GetMarkersResponseWithPagination } from './../../markers-api';

export function mockGetMarkersResponse(nextUrl?: string): GetMarkersResponseWithPagination {
  if (!nextUrl) {
    return mockGetMarkersResponsePage1;
  } else {
    return mockGetMarkersResponsePage2;
  }
}

const mockGetMarkersResponsePage1: GetMarkersResponseWithPagination = {
  nextUrl: 'next-url',
  previousUrl: null,
  totalRecords: 4,
  totalPages: 2,
  startIndex: 1,
  endIndex: 2,
  currentPage: 1,
  results: [
    {
      markerId: 0,
      lat: -111.33,
      lng: 149.243,
      park: 'S',
      numberOfPublicArticles: { total: 2, eachCategory: [0, 2, 0] },
    },
    {
      markerId: 1,
      lat: -105.184,
      lng: 138.721,
      park: 'S',
      numberOfPublicArticles: { total: 1, eachCategory: [0, 0, 1] },
    },
  ],
};

const mockGetMarkersResponsePage2: GetMarkersResponseWithPagination = {
  nextUrl: null,
  previousUrl: 'prev-url',
  totalRecords: 4,
  totalPages: 2,
  startIndex: 1,
  endIndex: 2,
  currentPage: 2,
  results: [
    {
      markerId: 2,
      lat: -166.044,
      lng: 55.335,
      park: 'S',
      numberOfPublicArticles: { total: 3, eachCategory: [1, 2, 0] },
    },
    {
      markerId: 3,
      lat: -132.51,
      lng: 40.566,
      park: 'S',
      numberOfPublicArticles: { total: 1, eachCategory: [0, 0, 1] },
    },
  ],
};
