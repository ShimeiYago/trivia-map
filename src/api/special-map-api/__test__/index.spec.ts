import { ApiError } from 'api/utils/handle-axios-error';
import { getSpecialMaps } from '../get-special-maps';
import { getSpecialMapMarkers } from '../get-special-map-markers';
import { getSpecialMap } from '../get-special-map';
import { postSpecialMap } from '../post-special-map';

describe('getspecialMaps', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getSpecialMaps({});
    expect(response.results[0].specialMapId).toBe(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getSpecialMaps({})).rejects.toEqual(expectedApiError);
  });
});

describe('getSpecialMapMarkers', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getSpecialMapMarkers({ mapId: 1 });
    expect(response.results[0].park).toBe('L');
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getSpecialMapMarkers({ mapId: 1 })).rejects.toEqual(expectedApiError);
  });
});

describe('getSpecialMap', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await getSpecialMap(1);
    expect(response.specialMapId).toBe(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(getSpecialMap(1)).rejects.toEqual(expectedApiError);
  });
});

describe('postSpecialMap', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle nomal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await postSpecialMap({
      title: '「関係者以外立ち入り禁止」看板マップ',
      description: 'パーク中の「関係者以外立ち入り禁止」の看板のまとめです。',
      selectablePark: 'both',
      isPublic: true,
    });
    expect(response.specialMapId).toBe(1);
  });

  it('handle thumbnail image', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await postSpecialMap({
      title: '「関係者以外立ち入り禁止」看板マップ',
      description: 'パーク中の「関係者以外立ち入り禁止」の看板のまとめです。',
      selectablePark: 'both',
      isPublic: true,
      thumbnail: {
        dataUrl: 'data:image/png;base64,xxx',
        fileName: 'filename',
      },
    });
    expect(response.specialMapId).toBe(1);
  });

  it('handle non public', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await postSpecialMap({
      title: '「関係者以外立ち入り禁止」看板マップ',
      description: 'パーク中の「関係者以外立ち入り禁止」の看板のまとめです。',
      selectablePark: 'both',
      isPublic: false,
    });
    expect(response.specialMapId).toBe(1);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(
      postSpecialMap({
        title: '「関係者以外立ち入り禁止」看板マップ',
        description: 'パーク中の「関係者以外立ち入り禁止」の看板のまとめです。',
        selectablePark: 'both',
        isPublic: false,
      }),
    ).rejects.toEqual(expectedApiError);
  });
});
