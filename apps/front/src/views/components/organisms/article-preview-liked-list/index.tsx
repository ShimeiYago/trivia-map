import { useAppDispatch } from 'store';
import { updateUser } from 'store/auths/actions';
import { throwError } from 'store/global-error/slice';
import { Renderer, Props } from './renderer';
import { useLocation } from 'react-router-dom';

export function ArticlePreviewLikedList(ownProps: OwnProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const search = location.search;
  const query = new URLSearchParams(search);

  const page = query.get('page') ? Number(query.get('page')) : 1;

  const props: Props = {
    location,
    page,
    variant: ownProps.variant,
    searchConditions: {},
    throwError: (status: number) => dispatch(throwError(status)),
    refreshUser: () => dispatch(updateUser(undefined)),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  variant: 'popup' | 'large' | 'sidebar';
};
