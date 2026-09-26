import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer } from '..';

let wrapper: ShallowWrapper<null, null, Renderer>;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
