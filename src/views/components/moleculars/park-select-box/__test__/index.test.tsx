import { shallow, ShallowWrapper } from 'enzyme';
import { ParkSelectBox, Props } from '..';

let wrapper: ShallowWrapper<Props, null, ParkSelectBox>;

const defaultProps: Props = {
  park: 'L',
  onChangePark: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<ParkSelectBox {...defaultProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('sea', () => {
    wrapper.setProps({
      park: 'S',
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleChange', () => {
  it('call onChangePark with "L"', () => {
    const instance = wrapper.instance();

    const event = {
      target: {
        checked: false,
      },
    };

    instance['handleChange'](event as React.ChangeEvent<HTMLInputElement>);
    expect(instance.props.onChangePark).toBeCalledWith('L');
  });

  it('call onChangePark with "S"', () => {
    const instance = wrapper.instance();

    const event = {
      target: {
        checked: true,
      },
    };

    instance['handleChange'](event as React.ChangeEvent<HTMLInputElement>);
    expect(instance.props.onChangePark).toBeCalledWith('S');
  });
});
