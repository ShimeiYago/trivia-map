import { shallow, ShallowWrapper } from 'enzyme';
import { ImageField, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, ImageField>;

const props: Props = {
  onChange: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<ImageField {...props} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with helperText', () => {
    wrapper.setProps({ helperText: 'text' });
    expect(wrapper).toMatchSnapshot();
  });

  it('with error', () => {
    wrapper.setProps({ error: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('with error & helperText', () => {
    wrapper.setProps({ error: true, helperText: 'text' });
    expect(wrapper).toMatchSnapshot();
  });

  it('disabled', () => {
    wrapper.setProps({ disabled: true });
    expect(wrapper).toMatchSnapshot();
  });
});
