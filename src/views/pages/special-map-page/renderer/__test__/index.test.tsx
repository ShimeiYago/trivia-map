import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';
import * as GetSpecialMapApiModule from 'api/special-map-api/get-special-map';
import * as GetSpecialMapMarkersApiModule from 'api/special-map-api/get-special-map-markers';
import { mockGetSpecialMapResponse } from 'api/mock/special-map-response';
import { mockGetSpecialMapMarkersResponseWithPagination } from 'api/mock/special-map-response';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;
let getSpecialMapSpy: jest.SpyInstance;
let getSpecialMapMarkersSpy: jest.SpyInstance;

const props: Props = {
  isMobile: true,
  windowHeight: 100,
  windowWidth: 100,
  throwError: jest.fn(),
  navigate: jest.fn(),
  mapId: 0,
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

  it('should call throwError if api calling fail', async () => {
    getSpecialMapSpy.mockRejectedValue(new Error());

    const instance = shallowWrapper.instance();
    await instance['fetchSpecialMap']();

    expect(instance.props.throwError).toBeCalled();
  });
});

describe('fetchSpecialMapMarkers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    shallowWrapper = shallow(<Renderer {...props} />);
    getSpecialMapMarkersSpy = jest.spyOn(GetSpecialMapMarkersApiModule, 'getSpecialMapMarkers');
  });

  it('should set markers if api calling succeed', async () => {
    getSpecialMapMarkersSpy.mockResolvedValue(mockGetSpecialMapMarkersResponseWithPagination);

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
