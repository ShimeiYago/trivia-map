import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as SleepModule from 'utils/sleep';

const basicProps: Props = {
  topBarPosition: 'fixed',
  children: 'contents',
  openAuthFormModal: false,
  loggedOutSuccessfully: false,
  pathName: '/',
  toggleAuthFormModal: jest.fn(),
  logout: jest.fn(),
  isMobile: false,
  isFormEditting: false,
};

let wrapper: ShallowWrapper<Props, State, Renderer>;

jest.spyOn(SleepModule, 'sleep');

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('new page', () => {
    wrapper.setProps({ pathName: '/map/new', isFormEditting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('edit page', () => {
    wrapper.setProps({ pathName: '/map/edit/1' });
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
        icon: 'https://...',
        url: 'https://...',
        isSocialAccount: false,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('redirect to top page', () => {
    wrapper.setState({
      redirectToTop: true,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with local navi', () => {
    wrapper.setProps({
      localBackNavi: {
        text: 'text',
        link: 'https://...',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with local navi & mobile', () => {
    wrapper.setProps({
      localBackNavi: {
        text: 'text',
        link: 'https://...',
      },
      isMobile: true,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('map page', () => {
    wrapper.setProps({
      mapPage: true,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('long name with mobile', () => {
    wrapper.setProps({
      userInfo: {
        email: 'xxx@example.com',
        userId: 1,
        nickname: 'xxxxxxxxxxxxxxx',
        icon: 'https://...',
        url: 'https://...',
        isSocialAccount: false,
      },
      isMobile: true,
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should set authMenuAnchorEl null when loggedOutSuccessfully is changed to true', () => {
    wrapper.setProps({
      loggedOutSuccessfully: true,
    });

    const instance = wrapper.instance();
    instance['componentDidUpdate']({ loggedOutSuccessfully: false } as Props, {} as State);
    expect(instance.state.authMenuAnchorEl).toBe(null);
  });

  it('should set redirectToTop false when redirectToTop is changed to true', () => {
    wrapper.setState({
      redirectToTop: true,
    });

    const instance = wrapper.instance();
    instance['componentDidUpdate']({} as Props, { redirectToTop: false } as State);
    expect(instance.state.redirectToTop).toBeFalsy();
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

describe('toggleAuthModal', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should open auth modal', () => {
    const instance = wrapper.instance();
    instance['toggleAuthModal'](true, 'login')();
    expect(instance.props.toggleAuthFormModal).toBeCalled();
  });
});

describe('handleLoginSucceed', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should call toggleAuthFormModal', async () => {
    const instance = wrapper.instance();
    await instance['handleLoginSucceed']();
    expect(instance.props.toggleAuthFormModal).toBeCalled();
  });
});

describe('handleClickLogout', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should call logout', async () => {
    const instance = wrapper.instance();
    await instance['handleClickLogout']();
    expect(instance.props.logout).toBeCalled();
  });
});
