import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  user: {
    userId: 1,
    nickname: 'Axel',
    email: 'xxx@example.com',
  },
  autoLoggingInState: 'success',
  isMobile: false,
  children: <div />,
  autoLogin: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('mobile', () => {
    wrapper.setProps({ isMobile: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('loading', () => {
    wrapper.setProps({ autoLoggingInState: 'loading' });
    expect(wrapper).toMatchSnapshot();
  });

  it('redirect', () => {
    wrapper.setProps({ autoLoggingInState: 'error' });
    expect(wrapper).toMatchSnapshot();
  });
});
