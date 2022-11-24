import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as UpdateUserInfoModule from 'api/auths-api/update-user-info';
import { mockGetUserInfoResponse } from 'api/mock/auths-response/get-user-info';
import { ApiError } from 'api/utils/handle-axios-error';

let wrapper: ShallowWrapper<Props, State, Renderer>;

let updateUserInfoSpy: jest.SpyInstance;

const basicProps: Props = {
  user: {
    userId: 1,
    email: 'xxx@example.com',
    nickname: 'Axel',
    icon: 'https://...',
    isSocialAccount: false,
  },
  updateUser: jest.fn(),
  throwError: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('loading', () => {
    wrapper.setState({
      loadingState: 'loading',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('error case', () => {
    wrapper.setState({
      errorTitle: 'error title',
      errorMessages: ['error1', 'error2'],
      formError: {
        nickname: ['nickname is invalid'],
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('success', () => {
    wrapper.setState({
      loadingState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with icon as file', () => {
    wrapper.setState({
      icon: {
        dataUrl: 'data-url',
        fileName: 'file-name',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with icon as null', () => {
    wrapper.setState({
      icon: null,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('social account', () => {
    wrapper.setProps({
      user: {
        userId: 1,
        email: '',
        nickname: 'Axel',
        icon: null,
        isSocialAccount: true,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('componentDidUpdate', () => {
  it('should set new user info', async () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const prevProps = {
      user: undefined,
    } as Props;

    instance['componentDidUpdate'](prevProps);

    expect(instance.state.nickname).toBe('Axel');
  });

  it('should set no user info', async () => {
    const props = {
      user: undefined,
    } as Props;

    wrapper = shallow(<Renderer {...props} />);
    const instance = wrapper.instance();

    instance['componentDidUpdate'](basicProps);

    expect(instance.state.nickname).toBe('');
  });
});

describe('handleChangenickname', () => {
  it('should set nickname', async () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const event = {
      target: {
        value: 'xxxxx',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangeNickname'](event);

    expect(instance.state.nickname).toBe('xxxxx');
  });
});

describe('handleSubmit', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    updateUserInfoSpy = jest.spyOn(UpdateUserInfoModule, 'updateUserInfo');
  });

  it('should set loadingState success when api succeed', async () => {
    updateUserInfoSpy.mockResolvedValue(mockGetUserInfoResponse);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.loadingState).toBe('success');
  });

  it('should set loadingState success', async () => {
    updateUserInfoSpy.mockResolvedValue(mockGetUserInfoResponse);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.loadingState).toBe('success');
  });

  it('should handle null image', async () => {
    updateUserInfoSpy.mockResolvedValue(mockGetUserInfoResponse);

    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.setState({
      icon: null,
      nickname: 'xxx',
    });
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(updateUserInfoSpy).toBeCalledWith({ icon: null, nickname: 'xxx' });
  });

  it('should set form error when api have validation error', async () => {
    const apiError: ApiError<UpdateUserInfoModule.ValidationError> = {
      status: 400,
      data: {
        nickname: ['nickname is invalid'],
      },
      errorMsg: '400 request is invalid',
    };
    updateUserInfoSpy.mockRejectedValue(apiError);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.formError).toEqual({
      nickname: ['nickname is invalid'],
    });
  });

  it('should set loadingstate error when api fail', async () => {
    updateUserInfoSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.loadingState).toBe('error');
  });
});

describe('handleChangeImage', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('set imageData when image is uploaded', async () => {
    const instance = wrapper.instance();

    const src = {
      dataUrl: 'data:image/png;base64,xxx',
      fileName: 'filename',
    };
    instance['handleChangeImage'](src);

    expect(instance.state.icon).toEqual({
      dataUrl: 'data:image/png;base64,xxx',
      fileName: 'filename',
    });
  });
});

describe('handleError', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should call throwError prop', () => {
    const instance = wrapper.instance();
    instance['handleError']();

    expect(instance.props.throwError).toBeCalled();
  });
});
