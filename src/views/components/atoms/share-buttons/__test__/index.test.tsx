import { shallow, ShallowWrapper } from 'enzyme';
import { ShareButtons, Props } from '..';

let wrapper: ShallowWrapper<Props>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<ShareButtons url="https://xxx.com" title="xxx" />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
