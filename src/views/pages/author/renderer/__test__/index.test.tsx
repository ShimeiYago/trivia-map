import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as GetAuthorInfoModule from 'api/users-api';

let wrapper: ShallowWrapper<Props, State, Renderer>;
let getAuthorInfoSpy: jest.SpyInstance;

const basicProps: Props = {
  userId: 1,
  throwError: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    wrapper.setState({
      author: {
        userId: 1,
        nickname: 'Axel',
        icon: 'https://xxx/xxx.jpg',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('loading', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('no icon', () => {
    wrapper.setState({
      author: {
        userId: 1,
        nickname: 'Axel',
        icon: null,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('fetchAuthor', () => {
  beforeEach(() => {
    getAuthorInfoSpy = jest.spyOn(GetAuthorInfoModule, 'getAuthorInfo');
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set author info when api succeed', async () => {
    getAuthorInfoSpy.mockResolvedValue({
      userId: 1,
      nickname: 'Axel',
      icon: null,
    });

    const instance = wrapper.instance();

    await instance['fetchAuthor']();

    expect(instance.state.author).toEqual({
      userId: 1,
      nickname: 'Axel',
      icon: null,
    });
  });

  it('should call throwError with 404 when api fail with 404', async () => {
    getAuthorInfoSpy.mockRejectedValue({ status: 404 });

    const instance = wrapper.instance();

    await instance['fetchAuthor']();

    expect(instance.props.throwError).toBeCalledWith(404);
  });

  it('should call throwError with 500 when api fail with unknown error', async () => {
    getAuthorInfoSpy.mockRejectedValue({});

    const instance = wrapper.instance();

    await instance['fetchAuthor']();

    expect(instance.props.throwError).toBeCalledWith(500);
  });
});
