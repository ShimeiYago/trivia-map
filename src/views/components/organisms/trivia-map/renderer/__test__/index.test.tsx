import { shallow, ShallowWrapper } from 'enzyme';
import { Map as LeafletMap } from 'leaflet';
import { Renderer, Props, State } from '..';

jest.useFakeTimers();

const basicProps: Props = {
  postMarkers: [
    {
      markerId: 100,
      lat: 0,
      lng: 0,
      park: 'S',
      numberOfPublicArticles: { total: 4, eachCategory: [1, 2, 1] },
    },
  ],
  initZoom: 1,
  markersFetchingState: 'success',
  fetchMarkers: jest.fn(),
  newMarkerMode: false,
  endToSelectPosition: jest.fn(),
  updatePosition: jest.fn(),
  hiddenMarkerIds: [],
  additinalMarkers: [
    {
      lat: 1,
      lng: 1,
      park: 'S',
    },
  ],
  updateIsEditting: jest.fn(),
  isFormEditting: false,
  park: 'S',
  isMobile: false,
};

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
    shallowWrapper.setState({
      map: { setView: jest.fn() } as unknown as LeafletMap,
    });
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

  it('with current marker', () => {
    shallowWrapper.setProps({
      shouldCurrentPositionAsyncWithForm: true,
      articleFormPosition: { lat: 0, lng: 0, park: 'S' },
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
      initCenter: { lat: 1, lng: 1, park: 'S' },
    });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('disabled map', () => {
    shallowWrapper.setProps({
      disabled: true,
      doNotShowPostMarkers: true,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('handleMapCreated', () => {
  it('should set map state', () => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
    const instance = shallowWrapper.instance();

    const map = { on: jest.fn(), invalidateSize: jest.fn() };
    instance['handleMapCreated'](map as unknown as LeafletMap);
    jest.runAllTimers();
    expect(instance.state.map).toEqual(map);
  });
});

describe('componentDidMount', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
    shallowWrapper.setProps({ fetchMarkers: jest.fn() });
  });

  it('should call fetchMarkers if markersFetchingState is waiting', () => {
    shallowWrapper.setProps({ markersFetchingState: 'waiting' });
    const instance = shallowWrapper.instance();

    instance['componentDidMount']();
    expect(instance.props.fetchMarkers).toBeCalled();
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should setZoom if changed to newMarker mode', () => {
    shallowWrapper.setState({
      map: {
        getZoom: () => 1,
        setZoom: jest.fn(),
      } as unknown as LeafletMap,
    });
    shallowWrapper.setProps({
      newMarkerMode: true,
    });
    const instance = shallowWrapper.instance();

    instance['componentDidUpdate'](basicProps);
    expect(instance.state.map?.setZoom).toBeCalled();
  });
});

describe('handleClickCancelNewMarker', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should call endToSelectPosition', async () => {
    const instance = shallowWrapper.instance();

    await instance['handleClickCancelNewMarker']();
    expect(instance.props.endToSelectPosition).toHaveBeenCalled();
  });

  it('should not call endToSelectPosition prop if endToSelectPosition is not setted', () => {
    shallowWrapper.setProps({ endToSelectPosition: undefined });
    const instance = shallowWrapper.instance();

    instance['handleClickCancelNewMarker']();
  });
});

describe('handleClickConfirmNewMarker', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
    shallowWrapper.setState({
      map: {
        getCenter: () => {
          return { lat: 0, lng: 0 };
        },
      } as unknown as LeafletMap,
    });
  });

  it('should call endToSelectPosition prop', () => {
    const instance = shallowWrapper.instance();

    instance['handleClickConfirmNewMarker']();
    expect(instance.props.endToSelectPosition).toHaveBeenCalled();
  });

  it('should not call endToSelectPosition prop if map is not setted', () => {
    shallowWrapper.setState({
      map: undefined,
    });
    const instance = shallowWrapper.instance();

    instance['handleClickConfirmNewMarker']();
    expect(instance.props.endToSelectPosition).not.toHaveBeenCalled();
  });

  it('should not call endToSelectPosition prop if endToSelectPosition is not setted', () => {
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
    expect(instance.state.openableNewMarkerPopup).toEqual(false);
  });
});

describe('openFormWithTheMarker', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should change currentPosition state', () => {
    const instance = shallowWrapper.instance();

    instance['openFormWithTheMarker']({
      lat: 1,
      lng: 1,
      park: 'S',
    });

    expect(instance.props.endToSelectPosition).toBeCalled();
  });

  it('should not call endToSelectPosition prop if endToSelectPosition is not setted', () => {
    shallowWrapper.setProps({ endToSelectPosition: undefined });
    const instance = shallowWrapper.instance();

    instance['openFormWithTheMarker']({
      lat: 1,
      lng: 1,
      park: 'S',
    });
  });
});
