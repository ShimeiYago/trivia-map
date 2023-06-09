import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';

let wrapper: ShallowWrapper<Props, State, Renderer>;

const basicProps: Props = {
  initialSearchConditions: {},
  initialOrder: 'latest',
  initialPage: 1,
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with form conditions', () => {
    wrapper.setState({
      formSearchConditions: {
        category: 1,
        park: 'L',
        keywords: ['keyword1', 'keyword2'],
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('searched', () => {
    wrapper.setState({
      currentSearchConditions: {
        category: 1,
        park: 'L',
        keywords: ['keyword1', 'keyword2'],
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('searched (sea)', () => {
    wrapper.setState({
      currentSearchConditions: {
        category: 1,
        park: 'S',
        keywords: ['keyword1', 'keyword2'],
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleChangeCategory', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
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
    wrapper = shallow(<Renderer {...basicProps} />);
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
    wrapper = shallow(<Renderer {...basicProps} />);
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

  it('should scroll', () => {
    const instance = wrapper.instance();

    instance.headingRef = {
      current: {
        scrollIntoView: jest.fn(),
      },
    } as unknown as React.RefObject<HTMLHeadingElement>;

    instance['handleClickFiltering']();

    expect(instance.headingRef.current?.scrollIntoView).toBeCalled();
  });
});

describe('handleClearFiltering', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should clear searchConditions', () => {
    wrapper.setState({
      currentSearchConditions: {
        category: 1,
        park: 'L',
      },
    });

    const instance = wrapper.instance();
    instance.headingRef = {
      current: {
        scrollIntoView: jest.fn(),
      },
    } as unknown as React.RefObject<HTMLHeadingElement>;

    instance['handleClearFiltering']();

    expect(instance.state.currentSearchConditions).toEqual({});
  });

  // it("should scroll", () => {
  //   const instance = wrapper.instance();

  //   instance.headingRef = {
  //     current: {
  //       scrollIntoView: jest.fn(),
  //     },
  //   } as unknown as React.RefObject<HTMLHeadingElement>;

  //   instance["handleClearFiltering"]();

  //   expect(instance.headingRef.current?.scrollIntoView).toBeCalled();
  // });
});

describe('handleChangeKeyword', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should set divided keywords', () => {
    const event = {
      target: {
        value: 'keyword1 keyword2　keyword3,keyword4 ,',
      },
    };

    const instance = wrapper.instance();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance['handleChangeKeyword'](event as any);

    expect(instance.state.formSearchConditions.keywords).toEqual([
      'keyword1',
      'keyword2',
      'keyword3',
      'keyword4',
    ]);
  });
});

describe('renderOrderSelectBox', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should set order key', () => {
    const event = {
      target: {
        value: 'popular',
      },
    };

    const instance = wrapper.instance();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance['handleChangeOrder'](event as any);

    expect(instance.state.order).toBe('popular');
  });
});

describe('handleChangePage', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should change page state', () => {
    const instance = wrapper.instance();
    instance['handleChangePage'](2);

    expect(instance.state.page).toBe(2);
  });
});
