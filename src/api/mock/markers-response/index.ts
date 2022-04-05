import { GetMarkersResponse } from 'api/markers-api';

export function mockGetMarkersResponse(pageIndex: number): GetMarkersResponse {
  switch (pageIndex) {
    case 1:
      return mockGetMarkersResponsePage1;
    case 2:
      return mockGetMarkersResponsePage2;
    case 3:
      return mockGetMarkersResponsePage3;
    default:
      return mockGetMarkersResponsePageLast;
  }
}

const mockGetMarkersResponsePage1 = {
  totalPage: 3,
  nextPageIndex: 2,
  markers: [
    {
      postId: '000',
      position: {
        lat: 22.27,
        lng: 29.268,
      },
      title: 'ノーチラス号',
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
  totalPage: 3,
  nextPageIndex: 3,
  markers: [
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

const mockGetMarkersResponsePage3 = {
  totalPage: 3,
  nextPageIndex: null,
  markers: [
    {
      postId: '004',
      position: {
        lat: 64.575,
        lng: -57.462,
      },
      title: '気象コントロールセンター',
    },
  ],
};

const mockGetMarkersResponsePageLast = {
  totalPage: 100,
  nextPageIndex: null,
  markers: [
    {
      postId: '005',
      position: {
        lat: 64.575,
        lng: -57.462,
      },
      title: '気象コントロールセンター',
    },
  ],
};
