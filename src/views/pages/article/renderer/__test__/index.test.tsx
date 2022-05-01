import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  title: 'title',
  content: 'content',
  articleLoadingState: 'success',
  fetchArticle: jest.fn(),
  isMobile: false,
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('loading', () => {
    wrapper.setProps({ articleLoadingState: 'loading' });
    expect(wrapper).toMatchSnapshot();
  });

  it('mobile view', () => {
    wrapper.setProps({ isMobile: true });
    expect(wrapper).toMatchSnapshot();
  });
});
