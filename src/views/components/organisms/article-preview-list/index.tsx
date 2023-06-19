import { GetArticlesPreviewsParam } from 'api/articles-api/get-articles-previews';
import { useAppDispatch } from 'store';
import { updateUser } from 'store/auths/actions';
import { throwError } from 'store/global-error/slice';
import { Props, Renderer } from './renderer';
import { useLocation } from 'react-router-dom';

export function ArticlePreviewList(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const search = location.search;
  const query = new URLSearchParams(search);

  const page = query.get('page') ? Number(query.get('page')) : 1;

  const props: Props = {
    location: location,
    page: page,
    variant: ownProps.variant,
    doesKeepPageParamInUrl: ownProps.doesKeepPageParamInUrl,
    searchConditions: ownProps.searchConditions,
    throwError: (status: number) => dispatch(throwError(status)),
    refreshUser: () => dispatch(updateUser(undefined)),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  variant: 'popup' | 'large' | 'sidebar';
  searchConditions: Omit<GetArticlesPreviewsParam, 'page'>;
  doesKeepPageParamInUrl?: boolean;
};
