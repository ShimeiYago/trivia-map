import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

const props: Props = {
  articleFormFetchingState: 'waiting',
  articleFormSubmittingState: 'waiting',
  closeFormModal: jest.fn(),
  markersDeletingState: 'waiting',
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
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should change states to show post success message', () => {
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

  it('should change states to show fetching form error message', () => {
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

  it('should change states to show deleting marker success message', () => {
    shallowWrapper.setProps({
      markersDeletingState: 'success',
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({
      ...props,
      markersDeletingState: 'success',
    });
    expect(instance.state.message).toBe('投稿を削除しました。');
  });

  it('should change states to show deleting marker error message', () => {
    shallowWrapper.setProps({
      markersDeletingState: 'error',
      markersErrorMsg: 'delete error',
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({
      ...props,
      markersDeletingState: 'loading',
    });
    expect(instance.state.message).toBe('delete error');
  });

  it('should change states to show deleting empty error message', () => {
    shallowWrapper.setProps({
      markersDeletingState: 'error',
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({
      ...props,
      markersDeletingState: 'loading',
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
