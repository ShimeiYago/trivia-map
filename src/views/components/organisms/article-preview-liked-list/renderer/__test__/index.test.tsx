import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
// import * as GetArticlesPreviewsApiModule from 'api/articles-api/get-articles-previews';
// import { mockGetArticlesPreviewsResponse } from 'api/mock/articles-response';
import * as GetLikedArticlesPreviewsModule from 'api/likes-api/get-liked-articles-previews';
import { mockGetLikedArticlesPreviewsResponse } from 'api/mock/likes-response';

let wrapper: ShallowWrapper<Props, State, Renderer>;
let getArticlesPreviewsSpy: jest.SpyInstance;

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
    getArticlesPreviewsSpy = jest.spyOn(GetLikedArticlesPreviewsModule, 'getLikedArticlesPreviews');
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('fetchArticlesPreviews', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getArticlesPreviewsSpy = jest.spyOn(GetLikedArticlesPreviewsModule, 'getLikedArticlesPreviews');
  });

  it('should set success states if api calling succeed', async () => {
    getArticlesPreviewsSpy.mockResolvedValue(mockGetLikedArticlesPreviewsResponse);

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
