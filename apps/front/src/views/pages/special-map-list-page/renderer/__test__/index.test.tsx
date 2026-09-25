import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';
import * as GetSpecialMapsApiModule from 'api/special-map-api/get-special-maps';
import { mockGetSpecialMapsResponseWithPagination } from 'api/mock/special-map-response';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;
let getSpecialMapsSpy: jest.SpyInstance;

const props: Props = {
  isMobile: true,
  throwError: jest.fn(),
  navigate: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('with special maps', () => {
    shallowWrapper.setState({
      specialMapsResponseWithPagination: mockGetSpecialMapsResponseWithPagination,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('with no special maps', () => {
    shallowWrapper.setState({
      specialMapsResponseWithPagination: {
        ...mockGetSpecialMapsResponseWithPagination,
        results: [],
      },
    });
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('fetchSpecialMaps', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    shallowWrapper = shallow(<Renderer {...props} />);
    getSpecialMapsSpy = jest.spyOn(GetSpecialMapsApiModule, 'getSpecialMaps');
  });

  it('should set specialMapsResponseWithPagination if api calling succeed', async () => {
    getSpecialMapsSpy.mockResolvedValue(mockGetSpecialMapsResponseWithPagination);

    const instance = shallowWrapper.instance();
    await instance['fetchSpecialMaps']();

    expect(instance.state.specialMapsResponseWithPagination?.currentPage).toBe(1);
  });

  it('should call throwError if api calling fail', async () => {
    getSpecialMapsSpy.mockRejectedValue(new Error());

    const instance = shallowWrapper.instance();
    await instance['fetchSpecialMaps']();

    expect(instance.props.throwError).toBeCalled();
  });
});

describe('handleChangePagination', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    shallowWrapper = shallow(<Renderer {...props} />);
    getSpecialMapsSpy = jest.spyOn(GetSpecialMapsApiModule, 'getSpecialMaps');
    getSpecialMapsSpy.mockResolvedValue(mockGetSpecialMapsResponseWithPagination);
  });

  it('should call getSpecialMaps if api calling succeed', () => {
    const instance = shallowWrapper.instance();
    instance['handleChangePagination']({} as React.ChangeEvent<unknown>, 1);

    expect(getSpecialMapsSpy).toBeCalled();
  });

  it('should scroll', () => {
    const instance = shallowWrapper.instance();

    instance.topRef = {
      current: {
        scrollIntoView: jest.fn(),
      },
    } as unknown as React.RefObject<HTMLDivElement>;

    instance['handleChangePagination']({} as React.ChangeEvent<unknown>, 1);

    expect(instance.topRef.current?.scrollIntoView).toBeCalled();
  });
});
