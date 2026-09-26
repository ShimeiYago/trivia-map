import { shallow, ShallowWrapper } from 'enzyme';
import { AreaNames, Props } from '..';

let wrapper: ShallowWrapper<Props>;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(
      <AreaNames areaNames={['シー', 'メディテレーニアンハーバー', 'ポルトパラディーゾ']} />,
    );
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
