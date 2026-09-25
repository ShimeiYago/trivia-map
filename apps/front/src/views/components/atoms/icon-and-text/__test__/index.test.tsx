import { shallow, ShallowWrapper } from 'enzyme';
import { IconAndText, Props } from '..';
import MapIcon from '@mui/icons-material/Map';

let wrapper: ShallowWrapper<Props>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<IconAndText iconComponent={<MapIcon />} text="地図" iconPosition="left" />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('right icon', () => {
    wrapper.setProps({
      iconPosition: 'right',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('left align', () => {
    wrapper.setProps({
      align: 'left',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with to', () => {
    wrapper.setProps({
      to: './',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with href', () => {
    wrapper.setProps({
      href: './',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with onClick', () => {
    wrapper.setProps({
      onClick: jest.fn,
    });
    expect(wrapper).toMatchSnapshot();
  });
});
