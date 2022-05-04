import { shallow, ShallowWrapper } from 'enzyme';
import { ArticlePaper, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, ArticlePaper>;

const props: Props = {
  children: 'article',
  variant: 'main',
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<ArticlePaper {...props} />);
  });

  it('main', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('navi', () => {
    wrapper.setProps({ variant: 'navi' });
    expect(wrapper).toMatchSnapshot();
  });
});
