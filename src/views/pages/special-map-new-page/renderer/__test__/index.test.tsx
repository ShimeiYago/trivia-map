import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State } from '..';

let wrapper: ShallowWrapper<null, State, Renderer>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('redirect', () => {
    wrapper.setState({
      specialMapIdForRedirect: 1,
    });
    expect(wrapper).toMatchSnapshot();
  });
});
