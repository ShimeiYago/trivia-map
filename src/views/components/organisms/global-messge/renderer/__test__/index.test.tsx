import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

const props: Props = {
  articleFormFetchingState: 'waiting',
  articleFormSubmittingState: 'waiting',
  readingArticleLoadingState: 'waiting',
  closeArticleModal: jest.fn(),
  closeFormModal: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('componentDidUpdate', () => {
  it('should change states to show post success message', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    shallowWrapper.setProps({
      articleFormSubmittingState: 'success',
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({
      ...props,
      articleFormSubmittingState: 'loading',
    });
    expect(instance.state.message).toBe('投稿が完了しました！');
  });

  it('should change states to show fetching article error message', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    shallowWrapper.setProps({
      readingArticleLoadingState: 'error',
      readingArticleErrorMsg: 'fetch error',
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({
      ...props,
      readingArticleLoadingState: 'loading',
    });
    expect(instance.state.message).toBe('fetch error');
  });

  it('should change states to show fetching article empty error message', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    shallowWrapper.setProps({
      readingArticleLoadingState: 'error',
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({
      ...props,
      readingArticleLoadingState: 'loading',
    });
    expect(instance.state.message).toBe('');
  });

  it('should change states to show fetching form error message', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    shallowWrapper.setProps({
      articleFormFetchingState: 'error',
      articleFormFetchingErrorMsg: 'fetch error',
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({
      ...props,
      articleFormFetchingState: 'loading',
    });
    expect(instance.state.message).toBe('fetch error');
  });

  it('should change states to show fetching empty form error message', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    shallowWrapper.setProps({
      articleFormFetchingState: 'error',
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({
      ...props,
      articleFormFetchingState: 'loading',
    });
    expect(instance.state.message).toBe('');
  });
});

describe('handleCloseMessage', () => {
  it('should change show state', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    shallowWrapper.setState({ show: true });
    const instance = shallowWrapper.instance();

    instance['handleCloseMessage']();
    expect(instance.state.show).toBeFalsy();
  });
});
