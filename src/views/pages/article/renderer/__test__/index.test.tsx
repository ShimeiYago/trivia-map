import { GetArticleResponse } from 'api/articles-api/get-remote-article';
import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as GetRemoteArticleModule from 'api/articles-api/get-remote-article';

let wrapper: ShallowWrapper<Props, State, Renderer>;

let getRemoteArticleSpy: jest.SpyInstance;

const basicProps: Props = {
  postId: 1,
  throwError: jest.fn(),
};

const article: GetArticleResponse = {
  postId: 1,
  title: 'title',
  description: 'description',
  marker: {
    markerId: 1,
    lat: 0,
    lng: 0,
    park: 'S',
    numberOfPublicArticles: 1,
    areaNames: ['シー'],
  },
  image: null,
  author: {
    userId: 1,
    nickname: 'Axel',
    icon: null,
  },
  createdAt: '2022/4/1',
  updatedAt: '2022/5/1',
  isDraft: false,
  category: 1,
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with article', () => {
    wrapper.setState({ article: article, loadingState: 'success' });
    expect(wrapper).toMatchSnapshot();
  });

  it('loading', () => {
    wrapper.setState({ loadingState: 'loading' });
    expect(wrapper).toMatchSnapshot();
  });

  it('with image', () => {
    wrapper.setState({
      article: { ...article, image: 'image.jpg' },
      loadingState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('draft', () => {
    wrapper.setState({
      article: { ...article, isDraft: true },
      loadingState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('author view', () => {
    wrapper.setProps({
      user: {
        nickname: 'Axel',
        userId: 1,
        email: 'xxx',
        icon: null,
      },
    });
    wrapper.setState({ article: article, loadingState: 'success' });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('fetchArticle', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getRemoteArticleSpy = jest.spyOn(
      GetRemoteArticleModule,
      'getRemoteArticle',
    );
  });

  it('should set loadingState success when api succeed', async () => {
    getRemoteArticleSpy.mockResolvedValue({});

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['fetchArticle']();

    expect(instance.state.loadingState).toBe('success');
  });

  it('should set redirectNotFound when api fail with 404', async () => {
    getRemoteArticleSpy.mockRejectedValue({ status: 404 });

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['fetchArticle']();

    expect(instance.props.throwError).toBeCalled();
  });

  it('should set loadingstate error when api fail', async () => {
    getRemoteArticleSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['fetchArticle']();

    expect(instance.props.throwError).toBeCalled();
  });
});
