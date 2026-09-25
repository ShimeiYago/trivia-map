import { Props, Renderer } from './renderer';
import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';

export function TwitterLoginPage() {
  const dispatch = useAppDispatch();

  const props: Props = {
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}
