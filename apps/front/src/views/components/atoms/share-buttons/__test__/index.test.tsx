import { shallow, ShallowWrapper } from 'enzyme';
import { ShareButtons, Props } from '..';

let wrapper: ShallowWrapper<Props>;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<ShareButtons url="https://xxx.com" title="xxx" description="xxx" />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('long description', () => {
    wrapper.setProps({
      title: '日本語付きtitle',
      description: 'long-text-'.repeat(30),
    });
    expect(wrapper.exists()).toBe(true);
  });
});
