import { shallow, ShallowWrapper } from 'enzyme';
import { GuideDialog, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, GuideDialog>;

const props: Props = {
  children: 'message',
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<GuideDialog {...props} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
