import { useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import { selectLoggedOutSuccessfully } from 'store/auths/selector';

export function GlobalMessage() {
  const props: Props = {
    loggedOutSuccessfully: useAppSelector(selectLoggedOutSuccessfully),
  };

  return <Renderer {...props} />;
}
