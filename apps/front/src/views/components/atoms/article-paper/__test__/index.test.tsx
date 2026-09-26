import { shallow, ShallowWrapper } from 'enzyme';
import { ArticlePaper, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, ArticlePaper>;

const props: Props = {
  children: 'article',
  variant: 'main',
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<ArticlePaper {...props} />);
  });

  it('main', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('navi', () => {
    wrapper.setProps({ variant: 'navi' });
    expect(wrapper.exists()).toBe(true);
  });
});
