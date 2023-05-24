import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';
import * as GetSpecialMapApiModule from 'api/special-map-api/get-special-map';
import { mockGetSpecialMapResponse } from 'api/mock/special-map-response';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;
let getSpecialMapSpy: jest.SpyInstance;

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
