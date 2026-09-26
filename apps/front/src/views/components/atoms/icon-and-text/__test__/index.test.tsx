import { shallow, ShallowWrapper } from 'enzyme';
import { IconAndText, Props } from '..';
import MapIcon from '@mui/icons-material/Map';

let wrapper: ShallowWrapper<Props>;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<IconAndText iconComponent={<MapIcon />} text="地図" iconPosition="left" />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('right icon', () => {
    wrapper.setProps({
      iconPosition: 'right',
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('left align', () => {
    wrapper.setProps({
      align: 'left',
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('with to', () => {
    wrapper.setProps({
      to: './',
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('with href', () => {
    wrapper.setProps({
      href: './',
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('with onClick', () => {
    wrapper.setProps({
      onClick: jest.fn,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
