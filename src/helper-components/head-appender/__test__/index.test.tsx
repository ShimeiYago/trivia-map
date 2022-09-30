import { shallow, ShallowWrapper } from 'enzyme';
import { HeadAppender, Props } from '..';

let wrapper: ShallowWrapper<Props>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<HeadAppender title="title">xxx</HeadAppender>);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
