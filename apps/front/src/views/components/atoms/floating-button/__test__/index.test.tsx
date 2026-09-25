import { shallow, ShallowWrapper } from 'enzyme';
import { FloatingButton, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, FloatingButton>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<FloatingButton />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with text', () => {
    wrapper.setProps({
      text: 'text',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('edit icon', () => {
    wrapper.setProps({
      icon: 'edit',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('add-marker icon', () => {
    wrapper.setProps({
      icon: 'add-marker',
    });
    expect(wrapper).toMatchSnapshot();
  });
});
