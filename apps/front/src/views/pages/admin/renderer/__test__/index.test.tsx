import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  user: {
    userId: 1,
    nickname: 'Axel',
    email: 'xxx@example.com',
    icon: 'https://...',
    url: 'https://...',
    isSocialAccount: false,
  },
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('no icon', () => {
    const props: Props = {
      user: {
        userId: 1,
        nickname: 'Axel',
        email: 'xxx@example.com',
        icon: null,
        url: null,
        isSocialAccount: false,
      },
    };
    wrapper.setProps(props);
    expect(wrapper.exists()).toBe(true);
  });
});
