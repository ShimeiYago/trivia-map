import { GetMarkersResponse } from 'api/markers-api';

export function mockGetMarkersResponse(nextUrl?: string): GetMarkersResponse {
  if (!nextUrl) {
    return mockGetMarkersResponsePage1;
  } else {
    return mockGetMarkersResponsePage2;
  }
}

const mockGetMarkersResponsePage1 = {
  count: 4,
  next: 'next-url',
  previous: null,
  results: [
    {
      postId: '000',
      position: {
        lat: 22.27,
        lng: 29.268,
      },
      title: 'ノーチラス号',
      thumbnailImgUrl:
        'https://www.disneyparkstory.com/wp-content/uploads/2017/02/CIMG9800-150x150.jpg',
    },
    {
      postId: '001',
      position: {
        lat: 30.524,
        lng: 15.908,
      },
      title: '削岩機',
    },
  ],
};

const mockGetMarkersResponsePage2 = {
  count: 4,
  next: null,
  previous: 'previous-url',
  results: [
    {
      postId: '002',
      position: {
        lat: -5.616,
        lng: -126.56,
      },
      title: 'S.S.コロンビア号',
    },
    {
      postId: '003',
      position: {
        lat: -49.937,
        lng: -106.94,
      },
      title: 'S.S.コロンビア号',
    },
  ],
};
