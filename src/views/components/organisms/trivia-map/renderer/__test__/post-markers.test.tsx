import { shallow, ShallowWrapper } from 'enzyme';
import { Map as LeafletMap } from 'leaflet';
import { PostMarkers, Props } from '../helpers/post-markers';

const basicProps: Props = {
  markers: [
    {
      markerId: 100,
      lat: 0,
      lng: 0,
      park: 'S',
      numberOfPublicArticles: 1,
    },
    {
      markerId: 101,
      lat: 0,
      lng: 0,
      park: 'S',
      numberOfPublicArticles: 1,
    },
  ],
  hiddenMarkerIds: [],
  map: { setView: jest.fn() } as unknown as LeafletMap,
  popupDisabled: false,
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
});
