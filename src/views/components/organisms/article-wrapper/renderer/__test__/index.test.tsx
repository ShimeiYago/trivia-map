import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  isMobile: false,
  showSidebar: true,
  children: <div />,
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('mobile', () => {
    wrapper.setProps({ isMobile: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('with sidebar', () => {
    wrapper.setProps({ showSidebar: false });
    expect(wrapper).toMatchSnapshot();
  });
});
