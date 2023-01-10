import { useAppDispatch } from 'store';
import { updateUser } from 'store/auths/actions';
import { throwError } from 'store/global-error/slice';
import { Renderer, Props } from './renderer';

export function ArticlePreviewLikedList(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
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
