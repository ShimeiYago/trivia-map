import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectReadingArticleContent,
  selectReadingArticleLoadingState,
  selectReadingArticleTitle,
} from 'store/reading-article/selector';
import { fetchReadingArticle } from 'store/reading-article/actions';
import { selectMarkersDeletingState } from 'store/markers/selector';

export function Article(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    title: useAppSelector(selectReadingArticleTitle),
    content: useAppSelector(selectReadingArticleContent),
    articleLoadingState: useAppSelector(selectReadingArticleLoadingState),
    markerDeletingState: useAppSelector(selectMarkersDeletingState),

    fetchArticle: () => dispatch(fetchReadingArticle(ownProps.postId)),
    onClickEdit: ownProps.onClickEdit,
    onClickDelete: ownProps.onClickDelete,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  postId: string;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
};
