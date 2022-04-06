import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

const props: Props = {
  markersCurrentPageToLoad: 1,
  markersTotalPages: 5,
  markersLoading: false,
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('on loading', () => {
    shallowWrapper.setProps({ markersLoading: true });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('init of loading', () => {
    shallowWrapper.setProps({
      markersTotalPages: undefined,
      markersLoading: true,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should show loading progress bar if markersLoading changes false -> true', () => {
    const prevProps: Props = props;
    shallowWrapper.setProps({ markersLoading: true });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate(prevProps);
    expect(instance.state.showLoadingProgressBar).toBeTruthy();
  });

  it('do not close loading progress bar soon even if markersLoading changes true -> false', () => {
    const prevProps: Props = { ...props, markersLoading: true };
    shallowWrapper.setProps({ markersLoading: false });
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
