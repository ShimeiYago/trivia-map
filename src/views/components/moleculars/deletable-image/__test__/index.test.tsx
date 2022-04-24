import { shallow, ShallowWrapper } from 'enzyme';
import { DeletableImage, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, DeletableImage>;

const props: Props = {
  src: 'image-data',
  alt: 'alt-text',
  onClick: jest.fn(),
  onDelete: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<DeletableImage {...props} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('width', () => {
    wrapper.setProps({
      width: 'full',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('height', () => {
    wrapper.setProps({
      height: 'full',
    });
    expect(wrapper).toMatchSnapshot();
  });
});
