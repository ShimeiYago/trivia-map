import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectArticleFormContent,
  selectArticleFormFetchingState,
  selectArticleFormFormError,
  selectArticleFormPosition,
  selectArticleFormSubmittingState,
  selectArticleFormTitle,
} from 'store/article-form/selector';
import {
  fetchArticle,
  initialize,
  submitEdittedArticle,
  submitNewArticle,
  updatePosition,
  updateTitle,
  updateContent,
} from 'store/article-form/actions';
import { Position } from 'types/position';

export function ArticleForm(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    postId: ownProps.postId,
    resume: !!ownProps.resume,
    title: useAppSelector(selectArticleFormTitle),
    content: useAppSelector(selectArticleFormContent),
    position: useAppSelector(selectArticleFormPosition),
    submittingState: useAppSelector(selectArticleFormSubmittingState),
    fetchingState: useAppSelector(selectArticleFormFetchingState),
    formError: useAppSelector(selectArticleFormFormError),

    updateTitle: (title: string) => dispatch(updateTitle(title)),
    updateContent: (content: string) => dispatch(updateContent(content)),
    updatePosition: (position: Position) => dispatch(updatePosition(position)),
    submitNewArticle: () => dispatch(submitNewArticle()),
    submitEdittedArticle: () => dispatch(submitEdittedArticle()),
    fetchArticle: (postId: string) => dispatch(fetchArticle(postId)),
    initialize: () => dispatch(initialize()),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  postId?: string;
  resume?: boolean;
};
