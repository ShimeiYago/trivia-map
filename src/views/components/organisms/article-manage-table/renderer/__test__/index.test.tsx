import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as GetMyArticlesApiModule from 'api/articles-api/get-my-articles';
import * as DeleteArticleApiModule from 'api/articles-api/delete-remote-article';
import * as PatchArticleApiModule from 'api/articles-api/patch-remote-article';
import { mockGetMyArticlesResponse } from 'api/mock/articles-response';
import { SelectChangeEvent } from '@mui/material';

let wrapper: ShallowWrapper<Props, State, Renderer>;
let getMyArticlesSpy: jest.SpyInstance;
let deleteArticleSpy: jest.SpyInstance;
let patchArticleSpy: jest.SpyInstance;

const basicProps: Props = {
  throwError: jest.fn(),
  isMobile: false,
  initializeFetchingState: jest.fn(),
  initialize: jest.fn(),
  refreshUser: jest.fn(),
  initialSearchParam: {
    page: undefined,
    category: undefined,
    park: undefined,
    isDraft: undefined,
  },
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
      articlesPreviews: mockGetMyArticlesResponse,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with articlesPreviews mobile view', () => {
    wrapper.setProps({
      isMobile: true,
    });
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: mockGetMyArticlesResponse,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('articlesPreviews is zero', () => {
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: {
        ...mockGetMyArticlesResponse,
        results: [],
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('one page', () => {
    wrapper.setState({
      loadingState: 'success',
      articlesPreviews: {
        ...mockGetMyArticlesResponse,
        totalPages: 1,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with message', () => {
    wrapper.setState({
      loadingState: 'success',
      message: {
        text: 'message',
        type: 'success',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with delete dialog', () => {
    wrapper.setState({
      loadingState: 'success',
      deleteDialog: {
        postId: 1,
        title: 'title',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with switch draft dialog to switch to draft', () => {
    wrapper.setState({
      loadingState: 'success',
      switchDraftDialog: {
        postId: 1,
        title: 'title',
        isDraft: true,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with switch draft dialog to switch to public', () => {
    wrapper.setState({
      loadingState: 'success',
      switchDraftDialog: {
        postId: 1,
        title: 'title',
        isDraft: false,
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

describe('switchDraftStatus', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    patchArticleSpy = jest.spyOn(PatchArticleApiModule, 'patchRemoteArticle');
  });

  it('should set success states if api calling succeed', async () => {
    patchArticleSpy.mockResolvedValue({});

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    await instance['switchDraftStatus'](1, true, 'title')();

    expect(instance.state.message?.type).toBe('success');
  });

  it('should set success states if api calling succeed with isDraft false', async () => {
    patchArticleSpy.mockResolvedValue({});

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    await instance['switchDraftStatus'](1, false, 'title')();

    expect(instance.state.message?.type).toBe('success');
  });

  it('should set error states if api calling fail', async () => {
    patchArticleSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    await instance['switchDraftStatus'](1, true, 'title')();

    expect(instance.state.message?.type).toBe('error');
  });
});

describe('handleChangeDraftStatus', () => {
  it('should change switchDraftDialog state to switch to draft', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    instance['handleChangeDraftStatus']({
      postId: 1,
      isDraft: true,
      title: 'title',
      category: 1,
      numberOfGoods: 1,
      image: null,
    })({ target: { value: 'true' } } as SelectChangeEvent);
    expect(instance.state.switchDraftDialog).toEqual({
      postId: 1,
      title: 'title',
      isDraft: true,
    });
  });

  it('should change switchDraftDialog state to switch to public', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    instance['handleChangeDraftStatus']({
      postId: 1,
      isDraft: false,
      title: 'title',
      category: 1,
      numberOfGoods: 1,
      image: null,
    })({ target: { value: 'false' } } as SelectChangeEvent);
    expect(instance.state.switchDraftDialog).toEqual({
      postId: 1,
      title: 'title',
      isDraft: false,
    });
  });
});

describe('closeSwitchDraftConfirmDialog', () => {
  it('should refresh switchDraftDialog state', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.setState({
      switchDraftDialog: {
        postId: 1,
        title: 'title',
        isDraft: true,
      },
    });
    const instance = wrapper.instance();

    instance['closeSwitchDraftConfirmDialog']();
    expect(instance.state.switchDraftDialog).toBe(undefined);
  });
});

describe('handleChangeCategory', () => {
  it('should change category value of searchParam state', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const event = { target: { value: '1' } } as unknown as SelectChangeEvent;

    instance['handleChangeCategory'](event);
    expect(instance.state.searchParam.category).toBe(1);
  });

  it('should set undefined category value of searchParam state', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const event = { target: { value: '' } } as unknown as SelectChangeEvent;

    instance['handleChangeCategory'](event);
    expect(instance.state.searchParam.category).toBe(undefined);
  });
});

describe('handleChangePark', () => {
  it('should change Land park value of searchParam state', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const event = { target: { value: 'L' } } as unknown as SelectChangeEvent;

    instance['handleChangePark'](event);
    expect(instance.state.searchParam.park).toBe('L');
  });

  it('should change Sea park value of searchParam state', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const event = { target: { value: 'S' } } as unknown as SelectChangeEvent;

    instance['handleChangePark'](event);
    expect(instance.state.searchParam.park).toBe('S');
  });

  it('should change undefined park value of searchParam state', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const event = { target: { value: '' } } as unknown as SelectChangeEvent;

    instance['handleChangePark'](event);
    expect(instance.state.searchParam.park).toBe(undefined);
  });

  describe('handleChangeDraft', () => {
    it('should change true isDraft value of searchParam state', () => {
      wrapper = shallow(<Renderer {...basicProps} />);
      const instance = wrapper.instance();

      const event = { target: { value: 'true' } } as unknown as SelectChangeEvent;

      instance['handleChangeDraft'](event);
      expect(instance.state.searchParam.isDraft).toBe('true');
    });

    it('should change false isDraft value of searchParam state', () => {
      wrapper = shallow(<Renderer {...basicProps} />);
      const instance = wrapper.instance();

      const event = { target: { value: 'false' } } as unknown as SelectChangeEvent;

      instance['handleChangeDraft'](event);
      expect(instance.state.searchParam.isDraft).toBe('false');
    });

    it('should change undefined park value of searchParam state', () => {
      wrapper = shallow(<Renderer {...basicProps} />);
      const instance = wrapper.instance();

      const event = { target: { value: '' } } as unknown as SelectChangeEvent;

      instance['handleChangeDraft'](event);
      expect(instance.state.searchParam.isDraft).toBe(undefined);
    });
  });

  describe('getDraftText', () => {
    it('should return 公開 if get false', () => {
      wrapper = shallow(<Renderer {...basicProps} />);
      const instance = wrapper.instance();

      const text = instance['getDraftText'](false);
      expect(text).toBe('公開');
    });

    it('should return 下書き if get false', () => {
      wrapper = shallow(<Renderer {...basicProps} />);
      const instance = wrapper.instance();

      const text = instance['getDraftText'](true);
      expect(text).toBe('下書き');
    });
  });
});
