import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as GetArticlesPreviewsApiModule from 'api/articles-api/get-articles-previews';
import { mockGetArticlesPreviewsResponse } from 'api/mock/articles-response';

let wrapper: ShallowWrapper<Props, State, Renderer>;
let getArticlesPreviewsSpy: jest.SpyInstance;

const articlesPreviewsZero = {
  ...mockGetArticlesPreviewsResponse,
  results: [],
};

const articlesPreviewsOnePage = {
  ...mockGetArticlesPreviewsResponse,
  totalRecords: 2,
  totalPages: 1,
  currentPage: 1,
  startIndex: 1,
  endIndex: 2,
};

const basicProps: Props = {
  searchConditions: {
    marker: 1,
  },
  variant: 'large',
  throwError: jest.fn(),
  refreshUser: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    wrapper = shallow(<Renderer {...basicProps} />);
    getArticlesPreviewsSpy = jest.spyOn(GetArticlesPreviewsApiModule, 'getArticlesPreviews');
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with articlesPreviews', () => {
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: mockGetArticlesPreviewsResponse,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('articlesPreviews is zero', () => {
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: articlesPreviewsZero,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('variant popup', () => {
    wrapper.setProps({ variant: 'popup' });
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: mockGetArticlesPreviewsResponse,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('variant sidebar', () => {
    wrapper.setProps({ variant: 'sidebar' });
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: mockGetArticlesPreviewsResponse,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('only one page with large', () => {
    wrapper.setProps({ variant: 'large' });
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: articlesPreviewsOnePage,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('only one page with popup', () => {
    wrapper.setProps({ variant: 'popup' });
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: articlesPreviewsOnePage,
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('fetchArticlesPreviews', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getArticlesPreviewsSpy = jest.spyOn(GetArticlesPreviewsApiModule, 'getArticlesPreviews');
  });

  it('should set success states if api calling succeed', async () => {
    getArticlesPreviewsSpy.mockResolvedValue(mockGetArticlesPreviewsResponse);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    await instance['fetchArticlesPreviews']();

    expect(instance.state.loadingState).toBe('success');
  });

  it('should call throwError if api calling fail', async () => {
    getArticlesPreviewsSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    await instance['fetchArticlesPreviews']();

    expect(instance.props.throwError).toBeCalled();
  });
});

describe('handleChangePagination', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getArticlesPreviewsSpy = jest.spyOn(GetArticlesPreviewsApiModule, 'getArticlesPreviews');
  });

  it('should set success states if api calling succeed', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    instance['handleChangePagination']({} as React.ChangeEvent<unknown>, 1);

    expect(getArticlesPreviewsSpy).toBeCalled();
  });

  it('should scroll', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    instance.topRef = {
      current: {
        scrollIntoView: jest.fn(),
      },
    } as unknown as React.RefObject<HTMLDivElement>;

    instance['handleChangePagination']({} as React.ChangeEvent<unknown>, 1);

    expect(instance.topRef.current?.scrollIntoView).toBeCalled();
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getArticlesPreviewsSpy = jest.spyOn(GetArticlesPreviewsApiModule, 'getArticlesPreviews');
  });

  it('should re-fetch and set undefined as articlesPreviews if searchConditions are changed', () => {
    wrapper.setProps({
      searchConditions: {
        category: 1,
      },
    });
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    instance['componentDidUpdate']({
      searchConditions: {},
    } as Props);

    expect(instance.state.articlesPreviews).toBe(undefined);
  });
});
