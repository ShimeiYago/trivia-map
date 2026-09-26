import { shallow, ShallowWrapper } from 'enzyme';
import { BoxField, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, BoxField>;

const props: Props = {
  children: 'test',
  onClick: jest.fn(),
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<BoxField {...props} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('with helperText', () => {
    wrapper.setProps({ helperText: 'text' });
    expect(wrapper.exists()).toBe(true);
  });

  it('with status valid', () => {
    wrapper.setProps({ status: 'valid' });
    expect(wrapper.exists()).toBe(true);
  });

  it('with status error', () => {
    wrapper.setProps({ status: 'error' });
    expect(wrapper.exists()).toBe(true);
  });

  it('with error & helperText', () => {
    wrapper.setProps({ status: 'error', helperText: 'text' });
    expect(wrapper.exists()).toBe(true);
  });

  it('disabled', () => {
    wrapper.setProps({ disabled: true });
    expect(wrapper.exists()).toBe(true);
  });
});
