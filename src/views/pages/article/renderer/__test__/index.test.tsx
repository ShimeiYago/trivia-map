import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  title: 'title',
  description: 'description',
  articleLoadingState: 'success',
  fetchArticle: jest.fn(),
  isMobile: false,
  position: { lat: 0, lng: 0, park: 'S' },
  imageUrl: null,
  author: {
    userId: 1,
    nickname: 'Axel',
  },
  createdAt: '2022/4/1',
  updatedAt: '2022/5/1',
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

  it('with image', () => {
    wrapper.setProps({ imageUrl: 'image.jpg' });
    expect(wrapper).toMatchSnapshot();
  });
});
