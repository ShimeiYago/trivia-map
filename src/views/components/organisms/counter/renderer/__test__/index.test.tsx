import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';

const basicProps: Props = {
  count: 0,
  counterError: null,
  loading: false,

  decrement: jest.fn(),
  increment: jest.fn(),
  incrementByAmount: jest.fn(),
  incrementIfOdd: jest.fn(),
  fetchCount: jest.fn(),
  postCount: jest.fn(),
};

let wrapper: ShallowWrapper<Props, State, Renderer>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('with error', () => {
    wrapper.setProps({ counterError: 'error' });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('decrement', () => {
  it('is called when "-" button is pushed', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.find('CounterButton[children="-"]').simulate('click');
    expect(basicProps.decrement).toBeCalled();
  });
});

describe('increment', () => {
  it('is called when "+" button is pushed', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.find('CounterButton[children="+"]').simulate('click');
    expect(basicProps.increment).toBeCalled();
  });
});

describe('incrementByAmount', () => {
  it('is called when "Add Amount" button is pushed', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.find('CounterButton[children="Add Amount"]').simulate('click');
    expect(basicProps.incrementByAmount).toBeCalled();
  });
});

describe('incrementIfOdd', () => {
  it('is called when "Add If Odd" button is pushed', () => {
    const wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.find('CounterButton[children="Add If Odd"]').simulate('click');
    expect(basicProps.incrementIfOdd).toBeCalled();
  });
});

describe('fetchCount', () => {
  it('is called when "Fetch" button is pushed', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.find('CounterButton[children="Fetch"]').simulate('click');
    expect(basicProps.fetchCount).toBeCalled();
  });
});

describe('postCount', () => {
  it('is called when "Post" button is pushed', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.find('CounterButton[children="Post"]').simulate('click');
    expect(basicProps.postCount).toBeCalled();
  });
});

describe('setIncrementAmount', () => {
  it('is called when textbox is changed and changes incrementAmount state', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper
      .find('CounterTextbox')
      .simulate('change', { target: { value: 'value' } });

    expect(wrapper.state().incrementAmount).toBe('value');
  });
});
