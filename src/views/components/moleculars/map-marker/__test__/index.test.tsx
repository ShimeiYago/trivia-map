import { shallow, ShallowWrapper } from 'enzyme';
import { MapMarker, Props, State } from '..';
import { LatLng, Map as LeafletMap } from 'leaflet';

let wrapper: ShallowWrapper<Props, State, MapMarker>;

const testMap = { flyTo: jest.fn(), getZoom: () => 1 } as unknown as LeafletMap;

const basicProps: Props = {
  position: new LatLng(0, 0),
  variant: 'blue',
  autoOpen: false,
  mapController: {
    map: testMap,
  },
  zIndexOffset: 0,
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<MapMarker {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with popup', () => {
    wrapper.setProps({
      mapController: { map: testMap, popup: 'popup-text' },
    });
    wrapper.setState({
      isPopupOpened: true,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('variant red', () => {
    wrapper.setProps({
      variant: 'red',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with numberOfContents', () => {
    wrapper.setProps({
      numberOfContents: 1,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('without map', () => {
    wrapper.setProps({
      mapController: undefined,
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('eventHandlers dragstart', () => {
  beforeEach(() => {
    wrapper = shallow(<MapMarker {...basicProps} />);
  });

  it('should call onDragStart prop', () => {
    wrapper.setProps({ onDragStart: jest.fn() });
    const instance = wrapper.instance();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['eventHandlers'] as any)(instance.props.mapController?.map).dragstart();
    expect(instance.props.onDragStart).toHaveBeenCalled();
  });

  it('should not call onDragStart prop if onDragStart prop is not provided', () => {
    const instance = wrapper.instance();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['eventHandlers'] as any)(instance.props.mapController?.map).dragstart();
  });
});

describe('eventHandlers dragend', () => {
  beforeEach(() => {
    wrapper = shallow(<MapMarker {...basicProps} />);
  });

  it('should call onDragEnd prop', () => {
    wrapper.setProps({ onDragEnd: jest.fn() });
    const instance = wrapper.instance();

    instance.markerRef = {
      current: {
        getLatLng: jest.fn(),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as React.RefObject<any>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['eventHandlers'] as any)(instance.props.mapController?.map).dragend();
    expect(instance.props.onDragEnd).toHaveBeenCalled();
  });

  it('should not call onDragEnd prop if markerRef is null', () => {
    const instance = wrapper.instance();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['eventHandlers'] as any)(instance.props.mapController?.map).dragend();
  });
});

describe('eventHandlers popupopen & popupclose', () => {
  beforeEach(() => {
    wrapper = shallow(<MapMarker {...basicProps} />);
  });

  it('popupopen should set isPopupOpened state true', () => {
    const instance = wrapper.instance();
    instance.setState({
      isPopupOpened: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['eventHandlers'] as any)(instance.props.mapController?.map).popupopen();
    expect(instance.state.isPopupOpened).toBeTruthy();
  });

  it('popupopen should call flyTo without zoom if already zoomed', () => {
    wrapper.setProps({
      mapController: { map: { flyTo: jest.fn(), getZoom: () => 5 } as unknown as LeafletMap },
      isMobile: true,
    });
    const instance = wrapper.instance();
    instance.setState({
      isPopupOpened: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['eventHandlers'] as any)(instance.props.mapController?.map).popupopen();
    expect(instance.props.mapController?.map.flyTo).toBeCalledWith({ lat: 10, lng: 0 }, undefined);
  });

  it('popupopen should call flyTo with zoom and gap move', () => {
    wrapper.setProps({
      mapController: { map: { flyTo: jest.fn(), getZoom: () => 1 } as unknown as LeafletMap },
      isMobile: true,
    });
    const instance = wrapper.instance();
    instance.setState({
      isPopupOpened: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['eventHandlers'] as any)(instance.props.mapController?.map).popupopen();
    expect(instance.props.mapController?.map.flyTo).toBeCalledWith({ lat: 30, lng: 0 }, 3);
  });

  it('popupclose should set isPopupOpened state false', async () => {
    const instance = wrapper.instance();
    instance.setState({
      isPopupOpened: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (instance['eventHandlers'] as any)(instance.props.mapController?.map).popupclose();
    expect(instance.state.isPopupOpened).toBeFalsy();
  });
});

describe('numberCircleEventHandlers click', () => {
  beforeEach(() => {
    wrapper = shallow(<MapMarker {...basicProps} />);
  });

  it('click should open popup', () => {
    const instance = wrapper.instance();

    instance.markerRef = {
      current: {
        openPopup: jest.fn(),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as React.RefObject<any>;

    instance.setState({
      isPopupOpened: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['numberCircleEventHandlers'] as any).click();

    expect(instance.markerRef.current?.openPopup).toHaveBeenCalled();
  });

  it('click should not open popup if markerRef is null', () => {
    const instance = wrapper.instance();

    instance.markerRef = {
      current: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as React.RefObject<any>;

    instance.setState({
      isPopupOpened: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['numberCircleEventHandlers'] as any).click();
  });
});
