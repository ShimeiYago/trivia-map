import { shallow, ShallowWrapper } from 'enzyme';
import { ErrorBoundary, Props, State } from 'error-boundary';

let wrapper: ShallowWrapper<Props, State, ErrorBoundary>;

function Something() {
  return null;
}

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(
      <ErrorBoundary>
        <Something />
      </ErrorBoundary>,
    );
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with thrown error', () => {
    global.console.log = jest.fn();

    const error = new Error('test');
    wrapper.find(Something).simulateError(error);

    expect(wrapper).toMatchSnapshot();
  });
});
