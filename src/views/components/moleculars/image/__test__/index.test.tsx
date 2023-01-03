import { shallow, ShallowWrapper } from 'enzyme';
import { Image, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Image>;

const props: Props = {
  src: 'image-data',
  alt: 'alt-text',
  onClick: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Image {...props} />);
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

  it('objectFit cover', () => {
    wrapper.setProps({
      objectFit: 'cover',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('border radius', () => {
    wrapper.setProps({
      borderRadius: true,
    });
    expect(wrapper).toMatchSnapshot();
  });
});
