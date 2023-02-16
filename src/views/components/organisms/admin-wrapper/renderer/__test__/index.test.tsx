import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  user: {
    userId: 1,
    nickname: 'Axel',
    email: 'xxx@example.com',
    icon: 'https://...',
    url: 'https://...',
    isSocialAccount: false,
  },
  autoLoggingInState: 'success',
  loggedOutSuccessfully: false,
  isMobile: false,
  children: <div />,
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

  it('redirect to login page', () => {
    wrapper.setProps({ autoLoggingInState: 'error' });
    expect(wrapper).toMatchSnapshot();
  });

  it('redirect to map page when logged out', () => {
    wrapper.setProps({ autoLoggingInState: 'error', loggedOutSuccessfully: true });
    expect(wrapper).toMatchSnapshot();
  });
});
