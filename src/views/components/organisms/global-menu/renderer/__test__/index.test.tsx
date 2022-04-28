import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';

const basicProps: Props = {
  barPosition: 'fixed',
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
    wrapper.setProps({ barPosition: 'static' });
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
