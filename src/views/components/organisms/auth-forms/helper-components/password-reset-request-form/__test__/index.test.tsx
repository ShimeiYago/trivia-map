import { shallow, ShallowWrapper } from 'enzyme';
import { PasswordResetRequestForm, Props, State } from '..';
// import * as LoginModule from 'api/auths-api/login';
// import { mockLoginResponse } from 'api/mock/auths-response/login';
// import { ApiError } from 'api/utils/handle-axios-error';

let wrapper: ShallowWrapper<Props, State, PasswordResetRequestForm>;

// let loginSpy: jest.SpyInstance;

const basicProps: Props = {
  switchMode: jest.fn(),
  email: '',
  onChangeEmail: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<PasswordResetRequestForm {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('error case', () => {
    wrapper.setState({
      errorTitle: 'error title',
      errorMessages: ['error1', 'error2'],
      formError: {
        email: ['email is invalid'],
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('success case', () => {
    wrapper.setState({
      localLoadingState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });
});
