import { shallow, ShallowWrapper } from 'enzyme';
import { Map as LeafletMap, MarkerCluster } from 'leaflet';
import { PostMarkers, Props } from '../helpers/post-markers';

const basicProps: Props = {
  markers: [
    {
      markerId: 100,
      lat: 0,
      lng: 0,
      park: 'S',
      numberOfPublicArticles: { total: 1, eachCategory: [1, 0, 0] },
    },
    {
      markerId: 101,
      lat: 0,
      lng: 0,
      park: 'S',
      numberOfPublicArticles: { total: 4, eachCategory: [1, 2, 1] },
    },
  ],
  hiddenMarkerIds: [],
  map: { setView: jest.fn() } as unknown as LeafletMap,
  popupDisabled: false,
  openFormWithTheMarker: jest.fn(),
  editting: false,
  isMobile: false,
  showNumberOfArticles: true,
};

let shallowWrapper: ShallowWrapper<Props, unknown, PostMarkers>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<PostMarkers {...basicProps} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('with hiddenMarkerIds', () => {
    shallowWrapper.setProps({ hiddenMarkerIds: [100] });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('form is editting', () => {
    shallowWrapper.setProps({ editting: true });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('category is selected', () => {
    shallowWrapper.setProps({ categoryId: 1 });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('without number of articles', () => {
    shallowWrapper.setProps({ showNumberOfArticles: false });
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('handleClickAdd', () => {
  it('should call openFormWithTheMarker', () => {
    shallowWrapper = shallow(<PostMarkers {...basicProps} />);
    const instance = shallowWrapper.instance();

    instance['handleClickAdd']({
      lat: 1,
      lng: 1,
      park: 'S',
    })();
    expect(instance.props.openFormWithTheMarker).toBeCalled();
  });
});

describe('clusterIconCreator', () => {
  it('should return div icon', () => {
    shallowWrapper = shallow(<PostMarkers {...basicProps} />);
    const instance = shallowWrapper.instance();

    const markerCluster = {
      getChildCount: () => 2,
    } as unknown as MarkerCluster;

    const divIcon = instance['clusterIconCreator'](markerCluster);
    expect(divIcon).toBeDefined();
  });
});
