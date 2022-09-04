import { shallow, ShallowWrapper } from 'enzyme';
import { AreaNames, Props } from '..';

let wrapper: ShallowWrapper<Props>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(
      <AreaNames
        areaNames={['シー', 'メディテレーニアンハーバー', 'ポルトパラディーゾ']}
      />,
    );
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
