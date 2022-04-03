import { shallow, ShallowWrapper } from 'enzyme';
import { BoxField, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, BoxField>;

const props: Props = {
  children: 'test',
  onClick: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<BoxField {...props} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with helperText', () => {
    wrapper.setProps({ helperText: 'text' });
    expect(wrapper).toMatchSnapshot();
  });

  it('with status valid', () => {
    wrapper.setProps({ status: 'valid' });
    expect(wrapper).toMatchSnapshot();
  });

  it('with status error', () => {
    wrapper.setProps({ status: 'error' });
    expect(wrapper).toMatchSnapshot();
  });

  it('with error & helperText', () => {
    wrapper.setProps({ status: 'error', helperText: 'text' });
    expect(wrapper).toMatchSnapshot();
  });
});
