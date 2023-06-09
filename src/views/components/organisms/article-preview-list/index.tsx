import { GetArticlesPreviewsParam } from 'api/articles-api/get-articles-previews';
import { useAppDispatch } from 'store';
import { updateUser } from 'store/auths/actions';
import { throwError } from 'store/global-error/slice';
import { Props, Renderer } from './renderer';

export function ArticlePreviewList(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    variant: ownProps.variant,
    searchConditions: ownProps.searchConditions,
    initialPage: ownProps.initialPage,
    throwError: (status: number) => dispatch(throwError(status)),
    refreshUser: () => dispatch(updateUser(undefined)),
    onChangePage: ownProps.onChangePage,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  variant: 'popup' | 'large' | 'sidebar';
  searchConditions: Omit<GetArticlesPreviewsParam, 'page'>;
  initialPage?: number;
  onChangePage?: (page: number) => void;
};
