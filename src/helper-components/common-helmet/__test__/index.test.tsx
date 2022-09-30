import { shallow, ShallowWrapper } from 'enzyme';
import { CommonHelmet, Props } from '..';

let wrapper: ShallowWrapper<Props>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<CommonHelmet title="title" />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
