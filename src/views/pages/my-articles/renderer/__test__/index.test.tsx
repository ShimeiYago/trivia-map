import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, null, Renderer>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with user', () => {
    wrapper.setProps({
      user: {
        userId: 1,
        email: 'xxx@example.com',
        nickname: 'xxx',
        icon: 'https://xxx.com/xxx.png',
        isSocialAccount: false,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});
