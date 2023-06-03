import { shallow, ShallowWrapper } from 'enzyme';
import { LoadingProgressBar, State, Props } from '..';

let shallowWrapper: ShallowWrapper<Props, State, LoadingProgressBar>;

const props: Props = {
  loadedPages: 1,
  totalPages: 5,
  fetchingState: 'waiting',
  isMobile: false,
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<LoadingProgressBar {...props} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('on loading', () => {
    shallowWrapper.setProps({ fetchingState: 'loading' });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('init of loading', () => {
    shallowWrapper.setProps({
      totalPages: undefined,
      fetchingState: 'loading',
    });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('mobile view', () => {
    shallowWrapper.setProps({
      isMobile: true,
    });
    shallowWrapper.setState({
      showLoadingProgressBar: true,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<LoadingProgressBar {...props} />);
  });

  it('should show loading progress bar if markersLoading changes to loading', () => {
    const prevProps: Props = props;
    shallowWrapper.setProps({ fetchingState: 'loading' });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate(prevProps);
    expect(instance.state.showLoadingProgressBar).toBeTruthy();
  });

  it('do not close loading progress bar soon even if markersLoading changes from loading', () => {
    const prevProps: Props = { ...props, fetchingState: 'loading' };
    shallowWrapper.setProps({ fetchingState: 'success' });
    shallowWrapper.setState({ showLoadingProgressBar: true });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate(prevProps);
    expect(instance.state.showLoadingProgressBar).toBeTruthy();
  });
});

describe('closeLoadingProgressBar', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<LoadingProgressBar {...props} />);
  });

  it('should close loading progress bar', async () => {
    shallowWrapper.setState({ showLoadingProgressBar: true });
    const instance = shallowWrapper.instance();
    instance.closeTimeMs = 0;

    await instance['closeLoadingProgressBar']();
    expect(instance.state.showLoadingProgressBar).toBeFalsy();
  });
});
