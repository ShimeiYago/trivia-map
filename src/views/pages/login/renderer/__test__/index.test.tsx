import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';
import * as SleepModule from 'utils/sleep';

let wrapper: ShallowWrapper<Props, State, Renderer>;

jest.spyOn(SleepModule, 'sleep');

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer initialMode="login" />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('redirect', () => {
    wrapper.setState({
      redirect: true,
    });
    expect(wrapper).toMatchSnapshot();
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
