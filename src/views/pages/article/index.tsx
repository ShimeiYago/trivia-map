import { Props, Renderer } from './renderer';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';

export function Article() {
  const dispatch = useAppDispatch();

  const { postId } = useParams();
  const postIdNumber = Number(postId);

  if (!postIdNumber) {
    dispatch(throwError(404));
  }

  const props: Props = {
    postId: postIdNumber,

    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}
