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

  it('with error', () => {
    wrapper.setProps({ error: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('with error & helperText', () => {
    wrapper.setProps({ error: true, helperText: 'text' });
    expect(wrapper).toMatchSnapshot();
  });
});
