import { Props, Renderer } from './renderer';
import { throwError } from 'store/global-error/slice';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'store';

export function VerifyEmail() {
  const dispatch = useAppDispatch();

  const { verifyKey } = useParams();
  // TODO
  if (!verifyKey) {
    throw Error;
  }

  const props: Props = {
    verifyKey: verifyKey,
    throwError: (status: number) => dispatch(throwError(status)),
  };

  return <Renderer {...props} />;
}
