import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  title: '',
  content: '',
  position: { lat: 0, lng: 0 },
  submittingState: 'waiting',
  fetchingState: 'waiting',
  resume: false,

  updateTitle: jest.fn(),
  updateContent: jest.fn(),
  updatePosition: jest.fn(),
  submitNewArticle: jest.fn(),
  submitEdittedArticle: jest.fn(),
  fetchArticle: jest.fn(),
  initialize: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('componentWillMount', () => {
  it('should not call initialize prop with resume mode', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.setProps({ resume: true });
    const instance = wrapper.instance();
    instance.componentWillMount();

    expect(basicProps.initialize).toBeCalled();
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

describe('handleChangeTitle', () => {
  it('call updateTitle', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const changeTitleEvent = { target: { value: 'new title' } };
    instance['handleChangeTitle'](
      changeTitleEvent as React.ChangeEvent<HTMLInputElement>,
    );

    expect(basicProps.updateTitle).toBeCalled();
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

    expect(basicProps.updateContent).toBeCalled();
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
