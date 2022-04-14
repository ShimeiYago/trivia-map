import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  title: '',
  content: '',
  position: { lat: 0, lng: 0 },
  submittingState: 'waiting',
  fetchingState: 'waiting',
  isFormEditting: false,

  updateFormField: jest.fn(),
  submitNewArticle: jest.fn(),
  submitEdittedArticle: jest.fn(),
  fetchArticle: jest.fn(),
  initialize: jest.fn(),
  updateIsEditting: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('position is not selected yet', () => {
    wrapper.setProps({ position: undefined });
    expect(wrapper).toMatchSnapshot();
  });

  it('with validation error', () => {
    wrapper.setProps({
      formError: {
        errorTitle: 'Inputted contents have errors.',
        headerErrors: ['position has an error'],
        fieldErrors: { position: 'position is not selected' },
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('loading', () => {
    wrapper.setProps({
      fetchingState: 'loading',
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('constructor', () => {
  it('should not call initialize prop with isEditting mode', () => {
    wrapper = shallow(<Renderer {...basicProps} isFormEditting />);
    expect(basicProps.initialize).not.toBeCalled();
  });
});

describe('componentDidMount', () => {
  it('fetchArticle if postId exists', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.setProps({ postId: 'postId-000' });
    const instance = wrapper.instance();
    instance.componentDidMount();

    expect(basicProps.fetchArticle).toBeCalled();
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should call scrollIntoView', () => {
    wrapper.setProps({ submittingState: 'error' });
    const instance = wrapper.instance();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messageRef: React.RefObject<any> = {
      current: {
        scrollIntoView: jest.fn(),
      },
    };
    instance.messageRef = messageRef;

    instance.componentDidUpdate(basicProps);
    expect(messageRef.current.scrollIntoView).toBeCalled();
  });

  it('should call fetchArticle if postId exists', () => {
    wrapper.setProps({ postId: 'postId-000' });
    const instance = wrapper.instance();
    instance.componentDidUpdate(basicProps);

    expect(basicProps.fetchArticle).toBeCalled();
  });
});

describe('componentWillUnmount', () => {
  it('fetchArticle if postId exists', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.setProps({ postId: 'postId-000' });
    wrapper.unmount();
    expect(basicProps.initialize).toBeCalled();
  });
});

describe('handleChangeTitle', () => {
  it('call updateTitle', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const changeTitleEvent = { target: { value: 'new title' } };
    instance['handleChangeTitle'](
      changeTitleEvent as React.ChangeEvent<HTMLInputElement>,
    );

    expect(basicProps.updateFormField).toBeCalled();
  });
});

describe('handleChangeContent', () => {
  it('call updateContent', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const changeContentEvent = { target: { value: 'new content' } };
    instance['handleChangeContent'](
      changeContentEvent as React.ChangeEvent<HTMLInputElement>,
    );

    expect(basicProps.updateFormField).toBeCalled();
  });
});

describe('handleSubmitButton', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('call submitNewArticle if postId does not exists', () => {
    const instance = wrapper.instance();
    instance['handleSubmitButton']();

    expect(basicProps.submitNewArticle).toBeCalled();
  });

  it('call submitEdittedArticle if postId exists', () => {
    wrapper.setProps({ postId: 'postId-000' });
    const instance = wrapper.instance();

    instance['handleSubmitButton']();

    expect(basicProps.submitEdittedArticle).toBeCalled();
  });
});
