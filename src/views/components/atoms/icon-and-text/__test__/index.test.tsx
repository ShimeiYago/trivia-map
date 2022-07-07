import { shallow, ShallowWrapper } from 'enzyme';
import { IconAndText, Props } from '..';
import MapIcon from '@mui/icons-material/Map';

let wrapper: ShallowWrapper<Props>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<IconAndText iconComponent={<MapIcon />} text="地図" />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
