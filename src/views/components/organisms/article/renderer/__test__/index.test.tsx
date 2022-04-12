import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  title: 'title',
  content: 'content',
  articleLoadingState: 'success',
  markerDeletingState: 'waiting',
  fetchArticle: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('loading', () => {
    wrapper.setProps({ articleLoadingState: 'loading' });
    expect(wrapper).toMatchSnapshot();
  });

  it('with edit button', () => {
    wrapper.setProps({ onClickEdit: jest.fn() });
    expect(wrapper).toMatchSnapshot();
  });

  it('with delete button', () => {
    wrapper.setProps({ onClickDelete: jest.fn() });
    expect(wrapper).toMatchSnapshot();
  });

  it('with loading delete button', () => {
    wrapper.setProps({
      onClickDelete: jest.fn(),
      markerDeletingState: 'loading',
    });
    expect(wrapper).toMatchSnapshot();
  });
});
