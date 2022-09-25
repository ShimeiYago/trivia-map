import { GetArticlesPreviewsParam } from 'api/articles-api/get-articles-previews';
import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';
import { Props, Renderer } from './renderer';

export function ArticlePreviewList(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    variant: ownProps.variant,
    searchConditions: ownProps.searchConditions,
    throwError: (status: number) => dispatch(throwError(status)),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  variant: 'popup' | 'large' | 'sidebar';
  searchConditions: Omit<GetArticlesPreviewsParam, 'page'>;
};
