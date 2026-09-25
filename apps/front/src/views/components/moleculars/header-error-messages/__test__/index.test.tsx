import { shallow, ShallowWrapper } from 'enzyme';
import { HeaderErrorMessages, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, HeaderErrorMessages>;

const props: Props = {
  errorTitle: 'Inputted values are invalid.',
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<HeaderErrorMessages {...props} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with errorMessages', () => {
    wrapper.setProps({ errorMessages: ['error1'] });
    expect(wrapper).toMatchSnapshot();
  });
});
