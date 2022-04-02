import { shallow, ShallowWrapper } from 'enzyme';
import { LatLng, LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import { Renderer, Props, State } from '..';

const basicProps: Props = {
  markerList: [
    {
      postId: '000',
      position: new LatLng(0, 0),
      title: 'title',
    },
  ],
  loadingMarkers: false,
  fetchMarkers: jest.fn(),
  newMarkerMode: false,
  endToSelectPosition: jest.fn(),
  updatePosition: jest.fn(),
};

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
    shallowWrapper.setState({ map: {} as LeafletMap });
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('when currentPosition state is setted', () => {
    shallowWrapper.setState({ currentPosition: new LatLng(1, 1) });
    shallowWrapper.setProps({ newMarkerMode: true });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('with onClickPostTitle props', () => {
    shallowWrapper.setProps({ onClickPostTitle: jest.fn() });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('with width and height props', () => {
    shallowWrapper.setProps({
      width: 100,
      height: 100,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('handleMapCreated', () => {
  it('should call map.on methods', () => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
    const instance = shallowWrapper.instance();

    const map = { on: jest.fn() };
    instance['handleMapCreated'](map as unknown as LeafletMap);
    expect(map.on).toHaveBeenCalled();
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should change currentPosition when newMarkerMode is changed', () => {
    shallowWrapper.setProps({ newMarkerMode: false });
    const instance = shallowWrapper.instance();

    instance['componentDidUpdate']({
      ...basicProps,
      newMarkerMode: true,
    });
    expect(instance.state.currentPosition).toBe(undefined);
  });
});

describe('handleMapClick', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should change currentPosition state with newMarkerMode', () => {
    shallowWrapper.setProps({ newMarkerMode: true });

    const instance = shallowWrapper.instance();

    const mouseClickEvent = {
      latlng: { lat: 1, lng: 1 },
    } as LeafletMouseEvent;

    expect(instance.state.currentPosition).toBe(undefined);
    instance['handleMapClick'](mouseClickEvent);
    expect(instance.state.currentPosition).toEqual({ lat: 1, lng: 1 });
  });

  it('should not change currentPosition state if not newMarkerMode', () => {
    const instance = shallowWrapper.instance();

    const mouseClickEvent = {
      latlng: { lat: 1, lng: 1 },
    } as LeafletMouseEvent;

    expect(instance.state.currentPosition).toBe(undefined);
    instance['handleMapClick'](mouseClickEvent);
    expect(instance.state.currentPosition).toEqual(undefined);
  });
});

describe('handleClickCancelNewMarker', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should change target states', async () => {
    shallowWrapper.setState({
      currentPosition: { lat: 0, lng: 0 },
    });
    const instance = shallowWrapper.instance();

    await instance['handleClickCancelNewMarker']();
    expect(instance.state.currentPosition).toEqual(undefined);
  });

  it('should not call endToSelectPosition prop if endToSelectPosition is not setted', () => {
    shallowWrapper.setState({ currentPosition: { lat: 0, lng: 0 } });
    shallowWrapper.setProps({ endToSelectPosition: undefined });
    const instance = shallowWrapper.instance();

    instance['handleClickCancelNewMarker']();
  });
});

describe('handleClickConfirmNewMarker', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should call endToSelectPosition prop', () => {
    shallowWrapper.setState({ currentPosition: { lat: 0, lng: 0 } });
    const instance = shallowWrapper.instance();

    instance['handleClickConfirmNewMarker']();
    expect(instance.props.endToSelectPosition).toHaveBeenCalled();
  });

  it('should not call endToSelectPosition prop if currentPosition state is not setted', () => {
    shallowWrapper.setState({ currentPosition: undefined });
    const instance = shallowWrapper.instance();

    instance['handleClickConfirmNewMarker']();
    expect(instance.props.endToSelectPosition).not.toHaveBeenCalled();
  });

  it('should not call endToSelectPosition prop if endToSelectPosition is not setted', () => {
    shallowWrapper.setState({ currentPosition: { lat: 0, lng: 0 } });
    shallowWrapper.setProps({ endToSelectPosition: undefined });
    const instance = shallowWrapper.instance();

    instance['handleClickConfirmNewMarker']();
  });
});

describe('handleDragStartNewMarker', () => {
  it('should change currentPosition', () => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
    const instance = shallowWrapper.instance();

    instance['handleDragStartNewMarker']();
    expect(instance.state.openNewMarkerPopup).toEqual(false);
  });
});

describe('handleDragEndNewMarker', () => {
  it('should change currentPosition', () => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
    const instance = shallowWrapper.instance();

    const newPosition = new LatLng(1, 1);

    instance['handleDragEndNewMarker'](newPosition);
    expect(instance.state.currentPosition).toEqual({ lat: 1, lng: 1 });
  });
});
