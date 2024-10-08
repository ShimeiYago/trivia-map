import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';
import * as GetAuthorInfoModule from 'api/users-api';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;
let getAuthorInfoSpy: jest.SpyInstance;

const props: Props = {
  isFormEditting: false,
  isMobile: true,
  isFormChangedFromLastSaved: false,
  park: 'S',
  windowHeight: 100,
  windowWidth: 100,
  new: false,
  initMapFocus: {
    zoom: 1,
    lat: 1,
    lng: 1,
  },
  updateFoocusingPark: jest.fn(),
  updateFilteringCategoryId: jest.fn(),
  throwError: jest.fn(),
  navigate: jest.fn(),
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

  it('park is undefined', () => {
    shallowWrapper.setProps({
      park: undefined,
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

  it('before render map', () => {
    shallowWrapper.setProps({
      windowWidth: 0,
      windowHeight: 0,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('author map', () => {
    shallowWrapper.setProps({
      userId: 1,
    });
    shallowWrapper.setState({
      author: {
        userId: 1,
        nickname: 'name',
        icon: null,
        url: null,
      },
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
    getAuthorInfoSpy = jest.spyOn(GetAuthorInfoModule, 'getAuthorInfo');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should open form modal if postIdToEdit is provided', () => {
    shallowWrapper.setProps({
      postIdToEdit: 100,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidMount();
    expect(instance.state.openFormModal).toBeTruthy();
  });

  it('should open form modal if new prop is provided', () => {
    shallowWrapper.setProps({
      new: true,
      isFormEditting: true,
      park: undefined,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidMount();
    expect(instance.state.openFormModal).toBeTruthy();
  });

  it('should add eventListener if isFormChangedFromLastSaved is true', () => {
    shallowWrapper.setProps({
      isFormChangedFromLastSaved: true,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidMount();
    expect(mockAddEventListener).toHaveBeenCalled();
  });

  it('should call getAuthorInfo if userId is set', () => {
    shallowWrapper.setProps({
      userId: 1,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidMount();
    expect(getAuthorInfoSpy).toHaveBeenCalled();
  });

  it('should call getElementById if category id is set', () => {
    const getElementByIdSpy = jest.spyOn(document, 'getElementById');
    shallowWrapper.setProps({
      filteringCategoryId: 1,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidMount();
    expect(getElementByIdSpy).toHaveBeenCalledWith('category-button-1');
  });
});

describe('componentWillUnmount', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
    jest.resetAllMocks();
  });

  it('should remove eventListener', () => {
    shallowWrapper.setProps({
      isFormChangedFromLastSaved: true,
    });
    const instance = shallowWrapper.instance();

    instance.componentWillUnmount();
    expect(mockRemoveEventListener).toHaveBeenCalled();
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

  it('should close modal if isFormEditting state is change to false', () => {
    shallowWrapper.setState({
      openFormModal: true,
    });

    shallowWrapper.setProps({
      isFormEditting: false,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({ isFormEditting: true } as Props, {} as State);
    expect(instance.state.openFormModal).toBeFalsy();
  });
});

describe('initializeCategoryStatus', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call updateFilteringCategoryId if queryCategoryId is defined', () => {
    shallowWrapper.setProps({
      queryCategoryId: 1,
    });
    const instance = shallowWrapper.instance();

    instance['initializeCategoryStatus']();
    expect(instance.props.updateFilteringCategoryId).toBeCalled();
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

describe('handleClickCategoryBarProceed', () => {
  it('should scroll category bar', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    instance.categoryScrollBarRef = {
      current: {
        scrollBy: jest.fn(),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as React.RefObject<any>;

    instance['handleClickCategoryBarProceed']();
    expect(instance.categoryScrollBarRef.current?.scrollBy).toBeCalled();
  });
});

describe('fetchAuthorInfo', () => {
  it('should throw error if api is failed with 404 error', async () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    getAuthorInfoSpy.mockRejectedValue({ status: 404 });

    await instance['fetchAuthorInfo'](1);

    expect(instance.props.throwError).toBeCalledWith(404);
  });

  it('should throw error if api is failed with unknown error', async () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    getAuthorInfoSpy.mockRejectedValue({});

    await instance['fetchAuthorInfo'](1);

    expect(instance.props.throwError).toBeCalledWith(500);
  });
});

describe('handleClickAuthorClose', () => {
  it('should call navigate props', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    const instance = shallowWrapper.instance();

    instance['handleClickAuthorClose']();

    expect(instance.props.navigate).toBeCalled();
  });
});
