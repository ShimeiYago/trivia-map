import { shallow, ShallowWrapper } from 'enzyme';
import { FloatingButton, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, FloatingButton>;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<FloatingButton />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('with text', () => {
    wrapper.setProps({
      text: 'text',
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('edit icon', () => {
    wrapper.setProps({
      icon: 'edit',
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('add-marker icon', () => {
    wrapper.setProps({
      icon: 'add-marker',
    });
    expect(wrapper.exists()).toBe(true);
  });
});
