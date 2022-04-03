import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

const props: Props = {
  isFormEditting: false,
  isMobile: true,
  articleFormSubmittingState: 'waiting',
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('pc view', () => {
    shallowWrapper.setProps({
      isMobile: false,
    });
    shallowWrapper.setState({
      openFormModal: true,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('componentDidUpdate', () => {
  it('should change states when post succeed', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    shallowWrapper.setProps({ articleFormSubmittingState: 'success' });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate(props);
    expect(instance.state.showMessage).toBeTruthy();
  });
});

describe('handleClickAddButton', () => {
  it('should set openingModal and edittingArticleId states', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    instance['handleClickAddButton']();
    expect(instance.state.openFormModal).toBeTruthy;
    expect(instance.state.readingArticleId).toBe(undefined);
  });
});

describe('handleClickPostTitle', () => {
  it('should set openingModal and readingArticleId states', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    instance['handleClickPostTitle']('postId-000')();
    expect(instance.state.openArticleModal).toBeTruthy;
    expect(instance.state.readingArticleId).toBe('postId-000');
  });
});

describe('handleClickPostEdit', () => {
  it('should set openingModal and edittingArticleId states', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    instance.setState({
      readingArticleId: 'postId-000',
    });

    instance['handleClickPostEdit']();
    expect(instance.state.openFormModal).toBeTruthy;
    expect(instance.state.edittingArticleId).toBe('postId-000');
  });
});

describe('handleOpenEditForm', () => {
  it('should open edit form modal', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    instance['handleOpenEditForm']();
    expect(instance.state.openFormModal).toBeTruthy;
  });
});

describe('handleCloseModal', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should close article modal', () => {
    const instance = shallowWrapper.instance();

    instance.setState({
      openArticleModal: true,
    });
    instance['handleCloseModal']('article')();
    expect(instance.state.openArticleModal).toBeFalsy;
  });

  it('should close form modal', () => {
    const instance = shallowWrapper.instance();

    instance.setState({
      openFormModal: true,
    });
    instance['handleCloseModal']('form')();
    expect(instance.state.openFormModal).toBeFalsy;
  });
});

describe('startToSelectPosition', () => {
  it('should set states', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();
    instance['startToSelectPosition']();
    expect(instance.state.openFormModal).toBeFalsy;
    expect(instance.state.newMarkerMode).toBe(true);
  });
});

describe('endToSelectPosition', () => {
  it('should set states', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();
    instance['endToSelectPosition']();
    expect(instance.state.openFormModal).toBeTruthy;
    expect(instance.state.newMarkerMode).toBe(false);
  });
});

describe('handleCloseMessage', () => {
  it('should change showMessage state', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    shallowWrapper.setState({ showMessage: true });
    const instance = shallowWrapper.instance();

    instance['handleCloseMessage']();
    expect(instance.state.showMessage).toBeFalsy();
  });
});
