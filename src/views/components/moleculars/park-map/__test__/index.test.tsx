import { shallow, ShallowWrapper } from 'enzyme';
import { Map as LeafletMap } from 'leaflet';
import { ParkMap, Props } from '..';

jest.useFakeTimers();

const basicProps: Props = {
  initZoom: 1,
  park: 'S',
};

let shallowWrapper: ShallowWrapper<Props, null, ParkMap>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<ParkMap {...basicProps} />);
    // shallowWrapper.setState({
    //   map: { setView: jest.fn() } as unknown as LeafletMap,
    // });
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('land map', () => {
    shallowWrapper.setProps({
      park: 'L',
    });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('with width and height props', () => {
    shallowWrapper.setProps({
      width: 100,
      height: 100,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('with initCenter prop', () => {
    shallowWrapper.setProps({
      initCenter: { lat: 1, lng: 1 },
    });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('disabled map', () => {
    shallowWrapper.setProps({
      disabled: true,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('position select', () => {
    shallowWrapper.setProps({
      positionSelectProps: {
        active: true,
        onConfirm: jest.fn(),
        onCancel: jest.fn(),
      },
    });
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('handleMapCreated', () => {
  it('should set map state', () => {
    shallowWrapper = shallow(<ParkMap {...basicProps} />);
    shallowWrapper.setProps({
      setMap: jest.fn(),
    });
    const instance = shallowWrapper.instance();

    const map = { on: jest.fn(), invalidateSize: jest.fn() };
    instance['handleMapCreated'](map as unknown as LeafletMap);
    jest.runAllTimers();
    expect(instance.props.setMap).toBeCalled();
  });
});
