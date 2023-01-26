import { shallow, ShallowWrapper } from 'enzyme';
import { MapLinkButton, Props } from '..';

let wrapper: ShallowWrapper<Props, null, MapLinkButton>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<MapLinkButton userId={1} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
