import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

const props: Props = {
  isFormEditting: false,
  isMobile: true,
  deleteArticle: jest.fn(),
};

const mockAddEventListener = jest
  .spyOn(window, 'addEventListener')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  .mockImplementation(() => {});

const mockRemoveEventListener = jest
  .spyOn(window, 'removeEventListener')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  .mockImplementation(() => {});

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

describe('handleClickAddButton', () => {
  it('should set openingModal and edittingArticleId states', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    instance['handleClickAddButton']();
    expect(instance.state.openFormModal).toBeTruthy;
    expect(instance.state.readingArticleId).toBe(undefined);
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
    jest.resetAllMocks();
  });

  it('should add beforeunload eventListener when form open', () => {
    shallowWrapper.setState({
      openFormModal: true,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate(props, { openFormModal: false } as State);
    expect(mockAddEventListener).toHaveBeenCalled();
  });

  it('should remove beforeunload eventListener when form close', () => {
    shallowWrapper.setState({
      openFormModal: false,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate(props, { openFormModal: true } as State);
    expect(mockRemoveEventListener).toHaveBeenCalled();
  });
});

describe('handleBeforeUnload', () => {
  it('should add beforeunload eventListener when form open', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    const event = {
      preventDefault: jest.fn(),
      returnValue: '',
    } as unknown as BeforeUnloadEvent;

    instance['handleBeforeUnload'](event);

    expect(event.returnValue).toBe(
      '未保存のデータがありますが、本当に閉じてもよろしいですか？',
    );
  });

  it('should remove beforeunload eventListener when form close', () => {
    shallowWrapper.setState({
      openFormModal: false,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate(props, { openFormModal: true } as State);
    expect(mockRemoveEventListener).toHaveBeenCalled();
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
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should open dialog when form modal is opening', () => {
    shallowWrapper.setState({ openFormModal: true });
    const instance = shallowWrapper.instance();

    instance['handleClickPostEdit']();
    expect(instance.state.openDoubleEditAlartDialog).toBeTruthy;
  });

  it('should set openingModal and edittingArticleId states', () => {
    const instance = shallowWrapper.instance();

    instance.setState({
      readingArticleId: 'postId-000',
    });

    instance['handleClickPostEdit']();
    expect(instance.state.openFormModal).toBeTruthy;
    expect(instance.state.edittingArticleId).toBe('postId-000');
  });
});

describe('handleClickPostDelete', () => {
  it('should set openDialogToConfirmDeleting state', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    instance['handleClickPostDelete']();
    expect(instance.state.openDialogToConfirmDeleting).toBeTruthy();
  });
});

describe('handleConfirmToDelete', () => {
  it('should call deleteArticle', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    instance.setState({
      readingArticleId: 'postId-000',
    });

    instance['handleConfirmToDelete']();
    expect(instance.props.deleteArticle).toBeCalled();
  });
});

describe('handleCancelToDeleteMarker', () => {
  it('should set openDialogToConfirmDeleting state', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    instance.setState({
      openDialogToConfirmDeleting: true,
    });

    instance['handleCancelToDeleteMarker']();
    expect(instance.state.openDialogToConfirmDeleting).toBeFalsy();
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

describe('handleCloseDoubleEditAlartDialog', () => {
  it('should close modal', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    shallowWrapper.setState({ openDoubleEditAlartDialog: true });
    const instance = shallowWrapper.instance();

    instance['handleCloseDoubleEditAlartDialog']();
    expect(instance.state.openDoubleEditAlartDialog).toBeFalsy();
  });
});
