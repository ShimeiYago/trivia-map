import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectReadingArticleDescription,
  selectReadingArticleLoadingState,
  selectReadingArticleTitle,
} from 'store/reading-article/selector';
import { fetchReadingArticle } from 'store/reading-article/actions';

export function Article(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    title: useAppSelector(selectReadingArticleTitle),
    description: useAppSelector(selectReadingArticleDescription),
    articleLoadingState: useAppSelector(selectReadingArticleLoadingState),

    fetchArticle: () => dispatch(fetchReadingArticle(ownProps.postId)),
    onClickEdit: ownProps.onClickEdit,
    onClickDelete: ownProps.onClickDelete,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  postId: number;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
};
