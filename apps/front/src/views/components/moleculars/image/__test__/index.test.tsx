import { shallow, ShallowWrapper } from 'enzyme';
import { Image, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Image>;

const props: Props = {
  src: 'image-data',
  alt: 'alt-text',
  onClick: jest.fn(),
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<Image {...props} />);
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

  it('max width and height', () => {
    wrapper.setProps({
      maxHeight: 'full',
      maxWidth: 'full',
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('objectFit cover', () => {
    wrapper.setProps({
      objectFit: 'cover',
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('border radius', () => {
    wrapper.setProps({
      borderRadius: true,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
