import { Props, Renderer } from './renderer';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { throwError } from 'store/global-error/slice';
import usePageTracking from 'helper-components/tracker';
import { selectUser } from 'store/auths/selector';
import { initialize } from 'store/article-form/actions';

export function Article() {
  const dispatch = useAppDispatch();

  usePageTracking();

  const { postId } = useParams();
  const postIdNumber = Number(postId);

  if (postIdNumber !== 0 && !postIdNumber) {
    dispatch(throwError(404));
  }

  const props: Props = {
    postId: postIdNumber,
    user: useAppSelector(selectUser),

    initialize: () => dispatch(initialize()),
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}
