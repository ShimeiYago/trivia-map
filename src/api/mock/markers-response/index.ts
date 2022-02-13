import { GetMarkersResponse } from 'api/markers-api';

export const mockGetMarkersResponse: GetMarkersResponse = [
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
];
