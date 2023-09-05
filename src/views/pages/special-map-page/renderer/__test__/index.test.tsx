import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';
import * as GetSpecialMapApiModule from 'api/special-map-api/get-special-map';
import * as GetSpecialMapMarkersApiModule from 'api/special-map-api/get-special-map-markers';
import { mockGetSpecialMapResponse } from 'api/mock/special-map-response';
import { mockGetSpecialMapMarkersResponseWithPagination } from 'api/mock/special-map-response';
import { Map as LeafletMap } from 'leaflet';
import { initialState as specialMapSettingFormInitialState } from 'store/special-map-setting/model';
import { initialState as specialMapMarkerFormInitialState } from 'store/special-map-marker-form/model';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;
let getSpecialMapSpy: jest.SpyInstance;
let getSpecialMapMarkersSpy: jest.SpyInstance;

const testMap = {
  on: jest.fn(),
  invalidateSize: jest.fn(),
  flyTo: jest.fn(),
} as unknown as LeafletMap;

const props: Props = {
  isMobile: true,
  windowHeight: 100,
  windowWidth: 100,
  throwError: jest.fn(),
  mapId: 0,
  editMode: false,
  refreshUser: jest.fn(),
  setSpecialMap: jest.fn(),
  specialMapSettingForm: specialMapSettingFormInitialState,
  specialMapMarkerForm: specialMapMarkerFormInitialState,
  updatePosition: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('without height', () => {
    shallowWrapper.setProps({
      windowHeight: 0,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('loading markers', () => {
    shallowWrapper.setState({
      loadingSpecialMap: false,
      specialMap: mockGetSpecialMapResponse,
      loadingMarkers: true,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('loaded', () => {
    shallowWrapper.setState({
      loadingSpecialMap: false,
      specialMap: mockGetSpecialMapResponse,
      loadingMarkers: false,
      markers: mockGetSpecialMapMarkersResponseWithPagination.results,
      map: testMap,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('loaded (pc)', () => {
    shallowWrapper.setProps({
      isMobile: false,
    });
    shallowWrapper.setState({
      loadingSpecialMap: false,
      specialMap: mockGetSpecialMapResponse,
      loadingMarkers: false,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('focusing a marker', () => {
    shallowWrapper.setProps({
      markerId: 1,
    });

    shallowWrapper.setState({
      loadingSpecialMap: false,
      specialMap: mockGetSpecialMapResponse,
      loadingMarkers: false,
      markers: mockGetSpecialMapMarkersResponseWithPagination.results,
      map: testMap,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('constructor', () => {
  it('should set initial park from props', () => {
    shallowWrapper = shallow(<Renderer {...props} park="S" />);
    const instance = shallowWrapper.instance();

    expect(instance.state.park).toBe('S');
  });
});

describe('fetchSpecialMap', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    shallowWrapper = shallow(<Renderer {...props} />);
    getSpecialMapSpy = jest.spyOn(GetSpecialMapApiModule, 'getSpecialMap');
  });

  it('should set specialMapsResponseWithPagination if api calling succeed', async () => {
    getSpecialMapSpy.mockResolvedValue(mockGetSpecialMapResponse);

    const instance = shallowWrapper.instance();
    await instance['fetchSpecialMap']();

    expect(instance.state.specialMap?.isPublic).toBeTruthy();
  });

  it('should update park state if selectablePark in api response is specific park', async () => {
    getSpecialMapSpy.mockResolvedValue({ ...mockGetSpecialMapResponse, selectablePark: 'S' });

    const instance = shallowWrapper.instance();
    await instance['fetchSpecialMap']();

    expect(instance.state.park).toBe('S');
  });

  it('should call throwError if api calling fail', async () => {
    getSpecialMapSpy.mockRejectedValue(new Error());

    const instance = shallowWrapper.instance();
    await instance['fetchSpecialMap']();

    expect(instance.props.throwError).toBeCalled();
  });

  it('should call throwError 404 when api fail with 404', async () => {
    getSpecialMapSpy.mockRejectedValue({ status: 404 });

    const instance = shallowWrapper.instance();
    await instance['fetchSpecialMap']();

    expect(instance.props.throwError).toHaveBeenCalledWith(404);
  });
});

describe('fetchSpecialMapMarkers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    shallowWrapper = shallow(<Renderer {...props} />);
    getSpecialMapMarkersSpy = jest.spyOn(GetSpecialMapMarkersApiModule, 'getSpecialMapMarkers');
  });

  it('should set markers if api calling succeed', async () => {
    getSpecialMapMarkersSpy.mockResolvedValue({
      ...mockGetSpecialMapMarkersResponseWithPagination,
      totalPages: 2,
    });

    const instance = shallowWrapper.instance();
    await instance['fetchSpecialMapMarkers']();

    expect(instance.state.loadingMarkers).toBeFalsy();
  });

  it('should call throwError if api calling fail', async () => {
    getSpecialMapMarkersSpy.mockRejectedValue(new Error());

    const instance = shallowWrapper.instance();
    await instance['fetchSpecialMapMarkers']();

    expect(instance.props.throwError).toBeCalled();
  });
});

describe('handleChangePark', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should update park state', async () => {
    const instance = shallowWrapper.instance();
    instance['handleChangePark']('S');

    expect(instance.state.park).toBe('S');
  });
});

describe('setMap', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should update map state', () => {
    const instance = shallowWrapper.instance();

    instance['setMap'](testMap);

    expect(instance.state.map).toBe(testMap);
  });
});
