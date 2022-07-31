import { shallow, ShallowWrapper } from 'enzyme';
import { NonStyleLink, Props } from '..';

let wrapper: ShallowWrapper<Props>;

const props: Props = {
  to: '/path',
  children: 'children',
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<NonStyleLink {...props} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
