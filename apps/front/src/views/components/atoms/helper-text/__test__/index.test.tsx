import { shallow, ShallowWrapper } from 'enzyme';
import { HelperText, Props } from '..';

let wrapper: ShallowWrapper<Props>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<HelperText>xxx</HelperText>);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('error', () => {
    wrapper.setProps({
      error: true,
    });
    expect(wrapper).toMatchSnapshot();
  });
});
