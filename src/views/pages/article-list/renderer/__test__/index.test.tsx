import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State } from '..';

let wrapper: ShallowWrapper<unknown, State, Renderer>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with form conditions', () => {
    wrapper.setState({
      formSearchConditions: {
        category: 1,
        park: 'L',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleChangeCategory', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer />);
  });

  it('should set category id number', () => {
    const event = {
      target: {
        value: '1',
      },
    };

    const instance = wrapper.instance();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance['handleChangeCategory'](event as any);

    expect(instance.state.formSearchConditions.category).toBe(1);
  });

  it('should set undefined', () => {
    const event = {
      target: {
        value: '',
      },
    };

    const instance = wrapper.instance();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance['handleChangeCategory'](event as any);

    expect(instance.state.formSearchConditions.category).toBe(undefined);
  });
});

describe('handleChangePark', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer />);
  });

  it('should set park L', () => {
    const event = {
      target: {
        value: 'L',
      },
    };

    const instance = wrapper.instance();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance['handleChangePark'](event as any);

    expect(instance.state.formSearchConditions.park).toBe('L');
  });

  it('should set park S', () => {
    const event = {
      target: {
        value: 'S',
      },
    };

    const instance = wrapper.instance();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance['handleChangePark'](event as any);

    expect(instance.state.formSearchConditions.park).toBe('S');
  });

  it('should set undefined', () => {
    const event = {
      target: {
        value: '',
      },
    };

    const instance = wrapper.instance();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance['handleChangePark'](event as any);

    expect(instance.state.formSearchConditions.park).toBe(undefined);
  });
});

describe('handleClickFiltering', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer />);
  });

  it('should synchronize searchConditions', () => {
    wrapper.setState({
      formSearchConditions: {
        category: 1,
        park: 'L',
      },
    });

    const instance = wrapper.instance();
    instance['handleClickFiltering']();

    expect(instance.state.currentSearchConditions).toEqual({
      category: 1,
      park: 'L',
    });
  });
});
