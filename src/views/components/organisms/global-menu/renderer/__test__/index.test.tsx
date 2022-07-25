import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';

const basicProps: Props = {
  topBarPosition: 'fixed',
  children: 'contents',
  openAuthFormModal: false,
  autoLogin: jest.fn(),
  toggleAuthFormModal: jest.fn(),
};

let wrapper: ShallowWrapper<Props, State, Renderer>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('static position', () => {
    wrapper.setProps({ topBarPosition: 'static' });
    expect(wrapper).toMatchSnapshot();
  });

  it('permanent left navi', () => {
    wrapper.setProps({ permanentLeftNavi: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('with userInfo', () => {
    wrapper.setProps({
      userInfo: {
        email: 'xxx@example.com',
        userId: 1,
        nickname: 'Axel',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('toggleLeftMenu', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should open left navi', () => {
    const instance = wrapper.instance();
    instance['toggleLeftMenu'](true)();
    expect(instance.state.openLeftNavi).toBeTruthy();
  });
});

describe('handleClickAuthMenu', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should set anchor element', () => {
    const event = {
      currentTarget: null,
    } as unknown as React.MouseEvent<HTMLElement>;
    const instance = wrapper.instance();
    instance['handleClickAuthMenu'](event);
    expect(instance.state.authMenuAnchorEl).toBe(null);
  });
});

describe('handleCloseAuthPopover', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should reset handleCloseAuthPopover', () => {
    const instance = wrapper.instance();
    instance['handleCloseAuthPopover']();
    expect(instance.state.authMenuAnchorEl).toBe(null);
  });
});
