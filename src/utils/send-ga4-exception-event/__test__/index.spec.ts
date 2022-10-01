import { sendGa4ExceptionEvent } from '..';
import ReactGA4 from 'react-ga4';

let gA4SendSpy: jest.SpyInstance;

describe('categoryMapper', () => {
  beforeEach(() => {
    jest.spyOn(ReactGA4, 'initialize');
    gA4SendSpy = jest.spyOn(ReactGA4, 'send');
    process.env.REACT_APP_ANALYTICS_ID = 'GA-xxx';
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env.REACT_APP_ANALYTICS_ID = '';
  });

  it('call ReactGA4 send', () => {
    sendGa4ExceptionEvent({
      errorCategory: 'api-error',
      message: 'unknown error',
      apiStatusCode: 500,
      apiEndpoint: 'https://xxx.com/api',
    });
    expect(gA4SendSpy).toBeCalledWith({
      hitType: 'event',
      eventAction: 'exception',
      eventValue: 'unknown error',
      eventCategory: 'api-error',
      eventLabel: '[500]https://xxx.com/api',
    });
  });

  it('call ReactGA4 send with label', () => {
    sendGa4ExceptionEvent({
      errorCategory: 'front-error',
      message: 'unknown error',
      errorLabel: 'type error',
    });
    expect(gA4SendSpy).toBeCalledWith({
      hitType: 'event',
      eventAction: 'exception',
      eventValue: 'unknown error',
      eventCategory: 'front-error',
      eventLabel: 'type error',
    });
  });

  it('do not call ReactGA4 if analytics id is not provided', () => {
    process.env.REACT_APP_ANALYTICS_ID = '';

    sendGa4ExceptionEvent({
      errorCategory: 'front-error',
      message: 'unknown error',
      errorLabel: 'type error',
    });
    expect(gA4SendSpy).not.toBeCalled();
  });
});
