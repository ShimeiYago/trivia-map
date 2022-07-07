import { shallow, ShallowWrapper } from 'enzyme';
import { MapMarker, Props, State } from '..';
import { LatLng, Map as LeafletMap } from 'leaflet';

let wrapper: ShallowWrapper<Props, State, MapMarker>;

const basicProps: Props = {
  position: new LatLng(0, 0),
  variant: 'blue',
  autoOpen: false,
  map: {} as LeafletMap,
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
      popup: 'popup-text',
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
});

describe('eventHandlers dragstart', () => {
  beforeEach(() => {
    wrapper = shallow(<MapMarker {...basicProps} />);
  });

  it('should call onDragStart prop', () => {
    wrapper.setProps({ onDragStart: jest.fn() });
    const instance = wrapper.instance();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['eventHandlers'] as any).dragstart();
    expect(instance.props.onDragStart).toHaveBeenCalled();
  });

  it('should not call onDragStart prop if onDragStart prop is not provided', () => {
    const instance = wrapper.instance();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['eventHandlers'] as any).dragstart();
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
    (instance['eventHandlers'] as any).dragend();
    expect(instance.props.onDragEnd).toHaveBeenCalled();
  });

  it('should not call onDragEnd prop if markerRef is null', () => {
    const instance = wrapper.instance();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['eventHandlers'] as any).dragend();
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
    (instance['eventHandlers'] as any).popupopen();
    expect(instance.state.isPopupOpened).toBeTruthy();
  });

  it('popupclose should set isPopupOpened state false', () => {
    const instance = wrapper.instance();
    instance.setState({
      isPopupOpened: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (instance['eventHandlers'] as any).popupclose();
    expect(instance.state.isPopupOpened).toBeFalsy();
  });
});
