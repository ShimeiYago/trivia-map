import { GetArticleResponse } from 'api/articles-api/get-remote-article';
import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as GetRemoteArticleModule from 'api/articles-api/get-remote-article';
import * as CheckGoodStatusModule from 'api/goods-api/check-good-status';
import * as ToggleGoodModule from 'api/goods-api/toggle-good';
import { mockGetArticleResponse } from 'api/mock/articles-response';

let wrapper: ShallowWrapper<Props, State, Renderer>;

let getRemoteArticleSpy: jest.SpyInstance;
let checkGoodStatusSpy: jest.SpyInstance;
let toggleGoodSpy: jest.SpyInstance;

const basicProps: Props = {
  postId: 1,
  focusingPark: 'S',
  initialize: jest.fn(),
  throwError: jest.fn(),
  refreshUser: jest.fn(),
  toggleAuthFormModal: jest.fn(),
  updateInitMapFocus: jest.fn(),
  updateFocusingPark: jest.fn(),
  initializeFetchingState: jest.fn(),
};

const testUser = {
  nickname: 'Axel',
  userId: 1,
  email: 'xxx',
  icon: null,
  url: null,
  isSocialAccount: false,
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
    numberOfPublicArticles: { total: 4, eachCategory: [1, 2, 1] },
    areaNames: ['シー'],
  },
  image: null,
  author: {
    userId: 1,
    nickname: 'Axel',
    icon: null,
    url: null,
  },
  createdAt: '2022/4/1',
  updatedAt: '2022/5/1',
  isDraft: false,
  category: 1,
  numberOfGoods: 1,
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with article', () => {
    wrapper.setState({ article: article, loadingArticleState: 'success' });
    expect(wrapper).toMatchSnapshot();
  });

  it('loading', () => {
    wrapper.setState({ loadingArticleState: 'loading' });
    expect(wrapper).toMatchSnapshot();
  });

  it('with image', () => {
    wrapper.setState({
      article: { ...article, image: 'image.jpg' },
      loadingArticleState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('draft', () => {
    wrapper.setState({
      article: { ...article, isDraft: true },
      loadingArticleState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('author view', () => {
    wrapper.setProps({
      user: testUser,
    });
    wrapper.setState({ article: article, loadingArticleState: 'success' });
    expect(wrapper).toMatchSnapshot();
  });

  it('have liked', () => {
    wrapper.setState({
      haveAddedGood: true,
      loadingArticleState: 'success',
      article: article,
      numberOfGoods: 0,
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    getRemoteArticleSpy = jest.spyOn(GetRemoteArticleModule, 'getRemoteArticle');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call fetchArticle if postId is updated', async () => {
    getRemoteArticleSpy.mockResolvedValue(mockGetArticleResponse);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    instance['componentDidUpdate']({
      ...basicProps,
      postId: 2,
    });

    expect(getRemoteArticleSpy).toBeCalled();
  });
});

describe('fetchArticle', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getRemoteArticleSpy = jest.spyOn(GetRemoteArticleModule, 'getRemoteArticle');
  });

  it('should set loadingArticleState success when api succeed', async () => {
    getRemoteArticleSpy.mockResolvedValue({});

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['fetchArticle']();

    expect(instance.state.loadingArticleState).toBe('success');
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

  it('should call initializeFetchingState if focusingPark is changed', async () => {
    getRemoteArticleSpy.mockResolvedValue(mockGetArticleResponse);

    wrapper = shallow(<Renderer {...basicProps} focusingPark="L" />);
    const instance = wrapper.instance();

    await instance['fetchArticle']();

    expect(instance.props.initializeFetchingState).toBeCalled();
  });
});

describe('checkGoodStatus', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    checkGoodStatusSpy = jest.spyOn(CheckGoodStatusModule, 'checkGoodStatus');
  });

  it('should set loadingLikeState success when api succeed', async () => {
    checkGoodStatusSpy.mockResolvedValue({
      haveAddedGood: true,
    });

    wrapper = shallow(<Renderer {...basicProps} user={testUser} />);
    const instance = wrapper.instance();

    await instance['checkGoodStatus']();

    expect(instance.state.loadingGoodState).toBe('success');
  });

  it('should set loadingstate error when api fail', async () => {
    checkGoodStatusSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} user={testUser} />);
    const instance = wrapper.instance();

    await instance['checkGoodStatus']();

    expect(instance.props.throwError).toBeCalled();
  });
});

describe('handleClickGoodButton', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    toggleGoodSpy = jest.spyOn(ToggleGoodModule, 'toggleGood');
  });

  it('should set loadingLikeState success when api succeed', async () => {
    toggleGoodSpy.mockResolvedValue({
      haveAddedGood: true,
      numberOfGoods: 1,
    });

    wrapper = shallow(<Renderer {...basicProps} user={testUser} />);
    const instance = wrapper.instance();

    await instance['handleClickGoodButton']();

    expect(instance.state.loadingGoodState).toBe('success');
  });

  it('should set loadingstate error when api fail', async () => {
    toggleGoodSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} user={testUser} />);
    const instance = wrapper.instance();

    await instance['handleClickGoodButton']();

    expect(instance.props.throwError).toBeCalled();
  });

  it('should call toggleAuthFormModal if user is undefined', async () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClickGoodButton']();

    expect(instance.props.toggleAuthFormModal).toBeCalled();
  });
});
