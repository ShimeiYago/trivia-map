import { shallow, ShallowWrapper } from 'enzyme';
import { BackToAccountSettingNavi } from '..';

let wrapper: ShallowWrapper<unknown, unknown, BackToAccountSettingNavi>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<BackToAccountSettingNavi />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
