import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';
import * as SleepModule from 'utils/sleep';

let wrapper: ShallowWrapper<Props, State, Renderer>;

jest.spyOn(SleepModule, 'sleep');

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer initialMode="login" />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('redirect', () => {
    wrapper.setState({
      redirect: true,
    });
    expect(wrapper.exists()).toBe(true);
  });
});

describe('redirectAfterSeveralSeconds', () => {
  it('should change redirect state', async () => {
    wrapper = shallow(<Renderer initialMode="login" />);
    const instance = wrapper.instance();
    await instance['redirectAfterSeveralSeconds']();
    expect(instance.state.redirect).toBeTruthy();
  });
});
