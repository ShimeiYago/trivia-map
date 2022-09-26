import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as GetArticlesPreviewsApiModule from 'api/articles-api/get-articles-previews';
import { mockGetArticlesPreviewsResponse } from 'api/mock/articles-response';

let wrapper: ShallowWrapper<Props, State, Renderer>;
let getArticlesPreviewsSpy: jest.SpyInstance;

const basicProps: Props = {
  searchConditions: {
    marker: 1,
  },
  variant: 'large',
  throwError: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    wrapper = shallow(<Renderer {...basicProps} />);
    getArticlesPreviewsSpy = jest.spyOn(
      GetArticlesPreviewsApiModule,
      'getArticlesPreviews',
    );
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with articlesPreviews', () => {
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: mockGetArticlesPreviewsResponse.results,
      totalPages: 2,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('articlesPreviews is zero', () => {
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: [],
      totalPages: 0,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('variant popup', () => {
    wrapper.setProps({ variant: 'popup' });
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: mockGetArticlesPreviewsResponse.results,
      totalPages: 2,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('variant sidebar', () => {
    wrapper.setProps({ variant: 'sidebar' });
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: mockGetArticlesPreviewsResponse.results,
      totalPages: 2,
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('fetchArticlesPreviews', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getArticlesPreviewsSpy = jest.spyOn(
      GetArticlesPreviewsApiModule,
      'getArticlesPreviews',
    );
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
    getArticlesPreviewsSpy = jest.spyOn(
      GetArticlesPreviewsApiModule,
      'getArticlesPreviews',
    );
  });

  it('should set success states if api calling succeed', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    instance['handleChangePagination']({} as React.ChangeEvent<unknown>, 1);

    expect(getArticlesPreviewsSpy).toBeCalled();
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getArticlesPreviewsSpy = jest.spyOn(
      GetArticlesPreviewsApiModule,
      'getArticlesPreviews',
    );
  });

  it('should re-fetch and set undefined as totalPages if searchConditions are changed', () => {
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

    expect(instance.state.totalPages).toBe(undefined);
  });
});
