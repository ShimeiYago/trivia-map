import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

const props: Props = {
  isFormEditting: false,
  isMobile: true,
  isFormChangedFromLastSaved: false,
  park: 'S',
  updateFoocusingPark: jest.fn(),
  updateFilteringCategoryId: jest.fn(),
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

  it('land mode', () => {
    shallowWrapper.setProps({
      park: 'L',
    });
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
  it('should set openingModal and edittingPostId states', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    instance['handleClickAddButton']();
    expect(instance.state.openFormModal).toBeTruthy;
    expect(instance.state.readingArticleId).toBe(undefined);
  });
});

describe('componentDidMount', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
    jest.resetAllMocks();
  });

  it('should open form modal', () => {
    shallowWrapper.setProps({
      postIdToEdit: 100,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidMount();
    expect(instance.state.openFormModal).toBeTruthy();
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
    jest.resetAllMocks();
  });

  it('should add beforeunload eventListener when form changed', () => {
    shallowWrapper.setProps({
      isFormChangedFromLastSaved: true,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({ isFormChangedFromLastSaved: false } as Props, {} as State);
    expect(mockAddEventListener).toHaveBeenCalled();
  });

  it('should remove beforeunload eventListener when form did not changed', () => {
    shallowWrapper.setProps({
      isFormChangedFromLastSaved: false,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({ isFormChangedFromLastSaved: true } as Props, {} as State);
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

    expect(event.returnValue).toBe('未保存のデータがありますが、本当に閉じてもよろしいですか？');
  });
});

describe('handleClickPostEdit', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should open dialog when form modal is opening', () => {
    shallowWrapper.setProps({ isFormChangedFromLastSaved: true });
    const instance = shallowWrapper.instance();

    instance['handleClickPostEdit']();
    expect(instance.state.openDoubleEditAlartDialog).toBeTruthy;
  });

  it('should set openingModal and edittingPostId states', () => {
    const instance = shallowWrapper.instance();

    instance.setState({
      readingArticleId: 100,
    });

    instance['handleClickPostEdit']();
    expect(instance.state.openFormModal).toBeTruthy;
    expect(instance.state.edittingPostId).toBe(100);
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

describe('handleCloseFormModal', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should close form modal', () => {
    const instance = shallowWrapper.instance();

    instance.setState({
      openFormModal: true,
    });
    instance['handleCloseFormModal']();
    expect(instance.state.openFormModal).toBeFalsy;
  });
});

describe('handleHideFormModal', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should close form modal', () => {
    const instance = shallowWrapper.instance();

    instance.setState({
      openFormModal: true,
    });
    instance['handleHideFormModal']();
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

describe('handleChangePark', () => {
  it('call updateFocusingPark with "L"', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    const event = {
      target: {
        checked: false,
      },
    };

    instance['handleChangePark'](event as React.ChangeEvent<HTMLInputElement>);
    expect(instance.props.updateFoocusingPark).toBeCalledWith('L');
  });

  it('call updateFocusingPark with "S"', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    const event = {
      target: {
        checked: true,
      },
    };

    instance['handleChangePark'](event as React.ChangeEvent<HTMLInputElement>);
    expect(instance.props.updateFoocusingPark).toBeCalledWith('S');
  });
});

describe('handleClickCategoryButton', () => {
  it('change category state', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    instance['handleClickCategoryButton'](1)();
    expect(instance.props.updateFilteringCategoryId).toBeCalledWith(1);
  });

  it('set undefined category state if same button is clicked', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    shallowWrapper.setProps({
      filteringCategoryId: 1,
    });
    const instance = shallowWrapper.instance();

    instance['handleClickCategoryButton'](1)();
    expect(instance.props.updateFilteringCategoryId).toBeCalledWith(undefined);
  });
});
