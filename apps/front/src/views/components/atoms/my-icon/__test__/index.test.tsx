import { shallow, ShallowWrapper } from 'enzyme';
import { MyIcon, Props } from '..';

let wrapper: ShallowWrapper<Props>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<MyIcon variant="map-marker" />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
