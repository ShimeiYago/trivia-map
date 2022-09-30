import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as GetMyArticlesApiModule from 'api/articles-api/get-my-articles';
import * as DeleteArticleApiModule from 'api/articles-api/delete-remote-article';
import { mockGetMyArticlesResponse } from 'api/mock/articles-response';

let wrapper: ShallowWrapper<Props, State, Renderer>;
let getMyArticlesSpy: jest.SpyInstance;
let deleteArticleSpy: jest.SpyInstance;

const basicProps: Props = {
  throwError: jest.fn(),
  isMobile: false,
  fetchMarkers: jest.fn(),
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
      articlesPreviews: mockGetMyArticlesResponse.results,
      totalPages: 2,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with articlesPreviews mobile view', () => {
    wrapper.setProps({
      isMobile: true,
    });
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: mockGetMyArticlesResponse.results,
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

  it('with meesage', () => {
    wrapper.setState({
      loadingState: 'success',
      message: {
        text: 'message',
        type: 'success',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with dialog', () => {
    wrapper.setState({
      loadingState: 'success',
      deleteDialog: {
        postId: 1,
        title: 'title',
      },
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
    getMyArticlesSpy.mockResolvedValue(mockGetMyArticlesResponse);

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

describe('deleteArticle', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    deleteArticleSpy = jest.spyOn(DeleteArticleApiModule, 'deleteRemoteArticle');
  });

  it('should set success states if api calling succeed', async () => {
    deleteArticleSpy.mockResolvedValue({});

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    await instance['deleteArticle'](1, 'title')();

    expect(instance.state.message?.type).toBe('success');
  });

  it('should set error states if api calling fail', async () => {
    deleteArticleSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    await instance['deleteArticle'](1, 'title')();

    expect(instance.state.message?.type).toBe('error');
  });
});

describe('handleCloseMessage', () => {
  it('should change message state', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.setState({
      message: {
        text: 'message',
        type: 'success',
      },
    });
    const instance = wrapper.instance();

    instance['handleCloseMessage']();
    expect(instance.state.message).toBe(undefined);
  });
});

describe('openDeleteConfirmDialog', () => {
  it('should change deleteDialog state', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    instance['openDeleteConfirmDialog'](1, 'title')();
    expect(instance.state.deleteDialog).toEqual({
      postId: 1,
      title: 'title',
    });
  });
});

describe('closeDeleteConfirmDialog', () => {
  it('should refresh deleteDialog state', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.setState({
      deleteDialog: {
        postId: 1,
        title: 'title',
      },
    });
    const instance = wrapper.instance();

    instance['closeDeleteConfirmDialog']();
    expect(instance.state.deleteDialog).toBe(undefined);
  });
});
