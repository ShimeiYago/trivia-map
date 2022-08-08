import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State } from '..';
import * as GetMyArticlesApiModule from 'api/articles-api/get-my-articles';
import { mockGetArticlesPreviewsResponse } from 'api/mock/articles-response';

let wrapper: ShallowWrapper<unknown, State, Renderer>;
let getMyArticlesSpy: jest.SpyInstance;

const basicProps = {
  throwError: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    wrapper = shallow(<Renderer {...basicProps} />);
    getMyArticlesSpy = jest.spyOn(GetMyArticlesApiModule, 'getMyArticles');
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
});

describe('fetchArticlesPreviews', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getMyArticlesSpy = jest.spyOn(GetMyArticlesApiModule, 'getMyArticles');
  });

  it('should set success states if api calling succeed', async () => {
    getMyArticlesSpy.mockResolvedValue(mockGetArticlesPreviewsResponse);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    await instance['fetchArticlesPreviews']();

    expect(instance.state.loadingState).toBe('success');
  });

  it('should set error states if api calling fail', async () => {
    getMyArticlesSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    await instance['fetchArticlesPreviews']();

    expect(instance.props.throwError).toBeCalled();
  });
});

describe('handleChangePagination', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getMyArticlesSpy = jest.spyOn(GetMyArticlesApiModule, 'getMyArticles');
  });

  it('should set success states if api calling succeed', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    instance['handleChangePagination']({} as React.ChangeEvent<unknown>, 1);

    expect(getMyArticlesSpy).toBeCalled();
  });
});
