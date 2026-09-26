import { shallow, ShallowWrapper } from 'enzyme';
import { HeaderErrorMessages, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, HeaderErrorMessages>;

const props: Props = {
  errorTitle: 'Inputted values are invalid.',
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<HeaderErrorMessages {...props} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('with errorMessages', () => {
    wrapper.setProps({ errorMessages: ['error1'] });
    expect(wrapper.exists()).toBe(true);
  });
});
