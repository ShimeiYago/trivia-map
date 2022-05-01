import { shallow, ShallowWrapper } from 'enzyme';
import { Map as LeafletMap } from 'leaflet';
import { PostMarkers, Props } from '../helpers/post-markers';

const basicProps: Props = {
  markers: {
    '000': {
      position: { lat: 0, lng: 0 },
      title: 'title1',
      thumbnailImgUrl: 'https://image.jpg',
    },
    '001': {
      position: { lat: 0, lng: 0 },
      title: 'title2',
    },
  },
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
    shallowWrapper.setProps({ hiddenMarkerIds: ['000'] });
    expect(shallowWrapper).toMatchSnapshot();
  });
});
