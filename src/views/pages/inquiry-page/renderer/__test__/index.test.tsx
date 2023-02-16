import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as InquiryModule from 'api/inquiry-api';
import { mockInquiryResponse } from 'api/mock/inquiry-response';
import { ApiError } from 'api/utils/handle-axios-error';

let wrapper: ShallowWrapper<Props, State, Renderer>;

let inquirySpy: jest.SpyInstance;

const origWidowScroll = window.scroll;

const basicProps: Props = {
  user: {
    userId: 1,
    email: 'xxx@example.com',
    nickname: 'Axel',
    icon: 'https://...',
    url: 'https://...',
    isSocialAccount: false,
  },
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
    window.scroll = jest.fn();
  });

  afterEach(() => {
    window.scroll = origWidowScroll;
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
        email: ['email is invalid'],
        name: ['name is invalid'],
        message: ['message is invalid'],
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
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
    window.scroll = jest.fn();
  });

  afterEach(() => {
    window.scroll = origWidowScroll;
  });

  it('should update email & name states when user is updated', () => {
    const instance = wrapper.instance();

    const prevProps: Props = {
      user: undefined,
    };

    instance['componentDidUpdate'](prevProps);

    expect(instance.state.name).toBe('Axel');
  });

  it('should reset email & name states when user is updated', () => {
    wrapper = shallow(<Renderer />);
    const instance = wrapper.instance();

    const prevProps: Props = {
      user: {
        userId: 1,
        email: 'xxx@example.com',
        nickname: 'Axel',
        icon: 'https://...',
        url: 'https://...',
        isSocialAccount: false,
      },
    };

    instance['componentDidUpdate'](prevProps);

    expect(instance.state.name).toBe('');
  });
});

describe('handleChangeTextField', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
    window.scroll = jest.fn();
  });

  afterEach(() => {
    window.scroll = origWidowScroll;
  });

  it('should set email', async () => {
    const instance = wrapper.instance();

    const event = {
      target: {
        value: 'xxxxx',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangeTextField']('email')(event);

    expect(instance.state.email).toBe('xxxxx');
  });

  it('should set name', async () => {
    const instance = wrapper.instance();

    const event = {
      target: {
        value: 'xxxxx',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangeTextField']('name')(event);

    expect(instance.state.name).toBe('xxxxx');
  });

  it('should set message', async () => {
    const instance = wrapper.instance();

    const event = {
      target: {
        value: 'xxxxx',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangeTextField']('message')(event);

    expect(instance.state.message).toBe('xxxxx');
  });
});

describe('handleChangeCategory', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should set null as image', () => {
    const event = {
      target: {
        value: 1,
      },
    };

    const instance = wrapper.instance();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance['handleChangeCategory'](event as any);

    expect(instance.state.tagIndex).toBe(1);
  });
});

describe('handleSubmit', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    inquirySpy = jest.spyOn(InquiryModule, 'inquiry');
    window.scroll = jest.fn();
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  afterEach(() => {
    window.scroll = origWidowScroll;
  });

  it('should set loadingState success when api succeed', async () => {
    inquirySpy.mockResolvedValue(mockInquiryResponse);

    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.loadingState).toBe('success');
  });

  it('should inquiry api with tag', async () => {
    inquirySpy.mockResolvedValue(mockInquiryResponse);

    wrapper.setState({
      tagIndex: 0,
    });
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(inquirySpy).toBeCalledWith({
      email: 'xxx@example.com',
      name: 'Axel',
      tag: '不具合の報告',
      message: '',
    });
  });

  it('should set form error when api have validation error', async () => {
    const apiError: ApiError<InquiryModule.ValidationError> = {
      status: 400,
      data: {
        name: ['name is invalid'],
      },
      errorMsg: '400 request is invalid',
    };
    inquirySpy.mockRejectedValue(apiError);

    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.formError).toEqual({
      name: ['name is invalid'],
    });
  });

  it('should set loadingstate error when api fail', async () => {
    inquirySpy.mockRejectedValue(new Error());

    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.loadingState).toBe('error');
  });
});
