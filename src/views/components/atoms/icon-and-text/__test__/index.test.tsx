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

  it('with link', () => {
    wrapper.setProps({
      link: './',
    });
    expect(wrapper).toMatchSnapshot();
  });
});
