import { Props, Renderer } from './renderer';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';
import usePageTracking from 'tracker';

export function AuthorPage() {
  const dispatch = useAppDispatch();

  usePageTracking();

  const { userId } = useParams();
  const userIdNumber = Number(userId);

  if (userIdNumber !== 0 && !userIdNumber) {
    dispatch(throwError(404));
  }

  const props: Props = {
    userId: userIdNumber,
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}
