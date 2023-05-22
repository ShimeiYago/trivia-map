import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

const props: Props = {
  isMobile: true,
  windowHeight: 100,
  windowWidth: 100,
  throwError: jest.fn(),
  navigate: jest.fn(),
  mapId: 0,
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('without height', () => {
    shallowWrapper.setProps({
      windowHeight: 0,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });
});
