import { shallow, ShallowWrapper } from 'enzyme';
import { DynamicAlignedText, Props } from '..';

let wrapper: ShallowWrapper<Props>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<DynamicAlignedText children="xxx" />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
