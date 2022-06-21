import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  title: '',
  description: '',
  imageDataUrl: null,
  position: {
    lat: 0,
    lng: 0,
    park: 'S',
  },
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

  it('with close button', () => {
    wrapper.setProps({
      onClose: jest.fn(),
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('with image', () => {
    wrapper.setProps({
      imageDataUrl: 'https://image-data.jpg',
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
    wrapper.setProps({ postId: 100 });
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
    const headerRef: React.RefObject<any> = {
      current: {
        scrollIntoView: jest.fn(),
      },
    };
    instance.headerRef = headerRef;

    instance.componentDidUpdate(basicProps);
    expect(headerRef.current.scrollIntoView).toBeCalled();
  });

  it('should call fetchArticle if postId exists', () => {
    wrapper.setProps({ postId: 100 });
    const instance = wrapper.instance();
    instance.componentDidUpdate(basicProps);

    expect(basicProps.fetchArticle).toBeCalled();
  });
});

describe('componentWillUnmount', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should not call initialize if isFormEditting', () => {
    wrapper.setProps({ isFormEditting: true });
    const instance = wrapper.instance();
    instance.componentWillUnmount();
    expect(instance.props.initialize).toBeCalledTimes(1);
  });

  it('should call initialize if not isFormEditting', () => {
    const instance = wrapper.instance();
    instance.componentWillUnmount();
    expect(instance.props.initialize).toBeCalledTimes(2);
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

describe('handleChangeDescription', () => {
  it('call updateContent', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const changeContentEvent = { target: { value: 'new content' } };
    instance['handleChangeDescription'](
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
    wrapper.setProps({ postId: 100 });
    const instance = wrapper.instance();

    instance['handleSubmitButton']();

    expect(basicProps.submitEdittedArticle).toBeCalled();
  });
});

describe('handleFileInputChange', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('set imageData when image is uploaded', async () => {
    const blob = new Blob(['image-data']);
    const file = new File([blob], 'test.jpeg', {
      type: 'image/jpeg',
    });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    const instance = wrapper.instance();
    await instance['handleFileInputChange'](event);

    expect(instance.props.updateFormField).not.toBeCalledWith({
      imageDataUrl: null,
    });
  });

  it('do not set imageData with no image', async () => {
    const event = {
      target: {
        files: [],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    const instance = wrapper.instance();
    await instance['handleFileInputChange'](event);

    expect(instance.props.updateFormField).toBeCalledWith({
      imageDataUrl: null,
    });
  });
});

describe('handleDeleteImage', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should set null as imageDataUrl', () => {
    const instance = wrapper.instance();
    instance['handleDeleteImage']();

    expect(instance.props.updateFormField).toBeCalledWith({
      imageDataUrl: null,
    });
  });
});
