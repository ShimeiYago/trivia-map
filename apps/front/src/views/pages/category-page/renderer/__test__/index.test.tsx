import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, null, Renderer>;

const basicProps: Props = {
  categoryId: 1,
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
