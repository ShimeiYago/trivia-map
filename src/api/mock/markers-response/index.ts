import { GetMarkersResponseWithPagination } from './../../markers-api';

export function mockGetMarkersResponse(
  nextUrl?: string,
): GetMarkersResponseWithPagination {
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
  currentPage: 1,
  results: [
    {
      markerId: 0,
      lat: 22.27,
      lng: 29.268,
      park: 'S',
      numberOfPublicArticles: 1,
    },
    {
      markerId: 1,
      lat: 30.524,
      lng: 15.908,
      park: 'S',
      numberOfPublicArticles: 2,
    },
  ],
};

const mockGetMarkersResponsePage2: GetMarkersResponseWithPagination = {
  nextUrl: null,
  previousUrl: 'prev-url',
  totalRecords: 4,
  totalPages: 2,
  currentPage: 2,
  results: [
    {
      markerId: 2,
      lat: -5.616,
      lng: -126.56,
      park: 'S',
      numberOfPublicArticles: 1,
    },
    {
      markerId: 3,
      lat: -49.937,
      lng: -106.94,
      park: 'S',
      numberOfPublicArticles: 1,
    },
  ],
};
