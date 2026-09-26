import { shallow, ShallowWrapper } from 'enzyme';
import { DeletableImage, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, DeletableImage>;

const props: Props = {
  src: 'image-data',
  alt: 'alt-text',
  onClick: jest.fn(),
  onDelete: jest.fn(),
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<DeletableImage {...props} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('width', () => {
    wrapper.setProps({
      width: 'full',
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('height', () => {
    wrapper.setProps({
      height: 'full',
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('errors', () => {
    wrapper.setProps({
      errors: ['xxx'],
    });
    expect(wrapper.exists()).toBe(true);
  });
});
