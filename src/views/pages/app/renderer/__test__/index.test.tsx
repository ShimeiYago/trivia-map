import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State } from '..';

let shallowWrapper: ShallowWrapper<unknown, State, Renderer>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('handleClickAddButton', () => {
  it('should set openingModal and edittingArticleId states', () => {
    shallowWrapper = shallow(<Renderer />);
    const instance = shallowWrapper.instance();

    instance['handleClickAddButton']();
    expect(instance.state.openingModal).toBe('form');
    expect(instance.state.readingArticleId).toBe(undefined);
  });
});

describe('handleClickPostTitle', () => {
  it('should set openingModal and readingArticleId states', () => {
    shallowWrapper = shallow(<Renderer />);
    const instance = shallowWrapper.instance();

    instance['handleClickPostTitle']('postId-000')();
    expect(instance.state.openingModal).toBe('article');
    expect(instance.state.readingArticleId).toBe('postId-000');
  });
});

describe('handleClickPostEdit', () => {
  it('should set openingModal and edittingArticleId states', () => {
    shallowWrapper = shallow(<Renderer />);
    const instance = shallowWrapper.instance();

    instance.setState({
      readingArticleId: 'postId-000',
    });

    instance['handleClickPostEdit']();
    expect(instance.state.openingModal).toBe('form');
    expect(instance.state.edittingArticleId).toBe('postId-000');
  });
});

describe('handleCloseModal', () => {
  it('should close modal', () => {
    shallowWrapper = shallow(<Renderer />);
    const instance = shallowWrapper.instance();

    instance.setState({
      openingModal: 'article',
    });
    instance['handleCloseModal']();
    expect(instance.state.openingModal).toBe('none');
  });
});

describe('startToSelectPosition', () => {
  it('should set states', () => {
    shallowWrapper = shallow(<Renderer />);
    const instance = shallowWrapper.instance();
    instance['startToSelectPosition']();
    expect(instance.state.openingModal).toBe('none');
    expect(instance.state.newMarkerMode).toBe(true);
  });
});

describe('endToSelectPosition', () => {
  it('should set states', () => {
    shallowWrapper = shallow(<Renderer />);
    const instance = shallowWrapper.instance();
    instance['endToSelectPosition']();
    expect(instance.state.openingModal).toBe('form');
    expect(instance.state.newMarkerMode).toBe(false);
    expect(instance.state.isFormResumed).toBe(true);
  });
});
