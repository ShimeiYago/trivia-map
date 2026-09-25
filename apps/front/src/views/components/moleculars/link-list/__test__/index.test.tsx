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

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<LinkList {...props} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
