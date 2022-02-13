import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { MapMarker, Props } from '..';
import { LatLng } from 'leaflet';

let wrapper: ShallowWrapper<Props, unknown, MapMarker>;

const basicProps: Props = {
  position: new LatLng(0, 0),
  type: 'default',
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<MapMarker {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with popup', () => {
    wrapper.setProps({
      popup: 'popup-text',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('type red', () => {
    wrapper.setProps({
      type: 'red',
    });
    expect(wrapper).toMatchSnapshot();
  });
});
