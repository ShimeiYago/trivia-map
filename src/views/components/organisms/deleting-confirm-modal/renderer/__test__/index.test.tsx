import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let shallowWrapper: ShallowWrapper<Props, unknown, Renderer>;

const props: Props = {
  open: true,
  markerDeletingState: 'waiting',
  onClickCancel: jest.fn(),
  onClickConfirm: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('loading', () => {
    shallowWrapper.setProps({
      open: false,
      markerDeletingState: 'loading',
    });
    expect(shallowWrapper).toMatchSnapshot();
  });
});
