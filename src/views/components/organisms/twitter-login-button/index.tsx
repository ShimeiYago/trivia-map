import { Props, Renderer } from './renderer';
import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';

export function TwitterLoginButton() {
  const dispatch = useAppDispatch();

  const props: Props = {
    redirectTo: (url: string) => window.location.replace(url),
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}
