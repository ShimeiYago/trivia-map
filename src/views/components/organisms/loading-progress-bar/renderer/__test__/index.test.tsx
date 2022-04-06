import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

const props: Props = {
  markersCurrentPageToLoad: 1,
  markersTotalPages: 5,
  markersFetchingState: 'waiting',
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('on loading', () => {
    shallowWrapper.setProps({ markersFetchingState: 'loading' });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('init of loading', () => {
    shallowWrapper.setProps({
      markersTotalPages: undefined,
      markersFetchingState: 'loading',
    });
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should show loading progress bar if markersLoading changes to loading', () => {
    const prevProps: Props = props;
    shallowWrapper.setProps({ markersFetchingState: 'loading' });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate(prevProps);
    expect(instance.state.showLoadingProgressBar).toBeTruthy();
  });

  it('do not close loading progress bar soon even if markersLoading changes from loading', () => {
    const prevProps: Props = { ...props, markersFetchingState: 'loading' };
    shallowWrapper.setProps({ markersFetchingState: 'success' });
    shallowWrapper.setState({ showLoadingProgressBar: true });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate(prevProps);
    expect(instance.state.showLoadingProgressBar).toBeTruthy();
  });
});

describe('closeLoadingProgressBar', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should close loading progress bar', async () => {
    shallowWrapper.setState({ showLoadingProgressBar: true });
    const instance = shallowWrapper.instance();
    instance.closeTimeMs = 0;

    await instance['closeLoadingProgressBar']();
    expect(instance.state.showLoadingProgressBar).toBeFalsy();
  });
});
