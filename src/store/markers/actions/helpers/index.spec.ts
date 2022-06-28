import { Marker } from 'store/markers/model';
import { concatMarkers, pushMarker, deleteOneMarker } from '.';

const origMarkers: Marker[] = [
  {
    markerId: 1,
    lat: 1,
    lng: 1,
    park: 'S',
    numberOfPublicArticles: 1,
  },
  {
    markerId: 2,
    lat: 2,
    lng: 2,
    park: 'S',
    numberOfPublicArticles: 2,
  },
];

describe('concatMarker', () => {
  it('should return combined marker list', () => {
    const newMarkers: Marker[] = [
      {
        markerId: 3,
        lat: 3,
        lng: 3,
        park: 'S',
        numberOfPublicArticles: 1,
      },
      {
        markerId: 4,
        lat: 4,
        lng: 4,
        park: 'S',
        numberOfPublicArticles: 1,
      },
    ];

    const actual = concatMarkers(origMarkers, newMarkers);
    const expected: Marker[] = [
      {
        markerId: 1,
        lat: 1,
        lng: 1,
        park: 'S',
        numberOfPublicArticles: 1,
      },
      {
        markerId: 2,
        lat: 2,
        lng: 2,
        park: 'S',
        numberOfPublicArticles: 2,
      },
      {
        markerId: 3,
        lat: 3,
        lng: 3,
        park: 'S',
        numberOfPublicArticles: 1,
      },
      {
        markerId: 4,
        lat: 4,
        lng: 4,
        park: 'S',
        numberOfPublicArticles: 1,
      },
    ];
    expect(actual).toEqual(expected);
  });
});

describe('pushMarker', () => {
  it('should return marker list including new marker if the markerId is new', () => {
    const newMarker: Marker = {
      markerId: 3,
      lat: 3,
      lng: 3,
      park: 'S',
      numberOfPublicArticles: 1,
    };

    const actual = pushMarker(origMarkers, newMarker);
    const expected: Marker[] = [
      {
        markerId: 1,
        lat: 1,
        lng: 1,
        park: 'S',
        numberOfPublicArticles: 1,
      },
      {
        markerId: 2,
        lat: 2,
        lng: 2,
        park: 'S',
        numberOfPublicArticles: 2,
      },
      {
        markerId: 3,
        lat: 3,
        lng: 3,
        park: 'S',
        numberOfPublicArticles: 1,
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('should increase numberOfPublicArticles of same marker as new', () => {
    const newMarker: Marker = {
      markerId: 1,
      lat: 3,
      lng: 3,
      park: 'S',
      numberOfPublicArticles: 1,
    };

    const actual = pushMarker(origMarkers, newMarker);
    const expected: Marker[] = [
      {
        markerId: 1,
        lat: 1,
        lng: 1,
        park: 'S',
        numberOfPublicArticles: 2,
      },
      {
        markerId: 2,
        lat: 2,
        lng: 2,
        park: 'S',
        numberOfPublicArticles: 2,
      },
    ];
    expect(actual).toEqual(expected);
  });
});

describe('deleteOneMarker', () => {
  it('should return marker list excluded target marker', () => {
    const actual = deleteOneMarker(origMarkers, 1);
    const expected: Marker[] = [
      {
        markerId: 2,
        lat: 2,
        lng: 2,
        park: 'S',
        numberOfPublicArticles: 2,
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('should decrease numberOfPublicArticles of target marker', () => {
    const actual = deleteOneMarker(origMarkers, 2);
    const expected: Marker[] = [
      {
        markerId: 1,
        lat: 1,
        lng: 1,
        park: 'S',
        numberOfPublicArticles: 1,
      },
      {
        markerId: 2,
        lat: 2,
        lng: 2,
        park: 'S',
        numberOfPublicArticles: 1,
      },
    ];
    expect(actual).toEqual(expected);
  });
});
