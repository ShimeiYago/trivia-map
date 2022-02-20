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
};

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('when currentPosition state is setted', () => {
    shallowWrapper.setState({ currentPosition: new LatLng(1, 1) });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('with onClickPostTitle props', () => {
    shallowWrapper.setProps({ onClickPostTitle: jest.fn() });
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

describe('handleMapClick', () => {
  it('should change currentPosition state', () => {
    shallowWrapper = shallow(<Renderer {...basicProps} />);
    const instance = shallowWrapper.instance();

    const mouseClickEvent = {
      latlng: { lat: 0, lng: 0 },
    } as LeafletMouseEvent;

    expect(instance.state.currentPosition).toBe(undefined);
    instance['handleMapClick'](mouseClickEvent);
    expect(instance.state.currentPosition).toEqual(new LatLng(0, 0));
  });
});
