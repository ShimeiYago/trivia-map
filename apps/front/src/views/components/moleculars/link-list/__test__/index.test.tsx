import { shallow, ShallowWrapper } from 'enzyme';
import { LinkList, Props } from '..';

let wrapper: ShallowWrapper<Props>;

const props: Props = {
  list: [
    {
      icon: 'x',
      text: 'text',
      link: 'https://xxx',
    },
  ],
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<LinkList {...props} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
