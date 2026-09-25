import { Props, Renderer } from './renderer';
import { useAppSelector } from 'store';
import {
  selectAutoLoggingInState,
  selectLoggedOutSuccessfully,
  selectUser,
} from 'store/auths/selector';
import { UseAutoLogin } from 'helper-components/use-auto-login';

export function AdminWrapper(ownProps: OwnProps) {
  UseAutoLogin();

  const props: Props = {
    user: useAppSelector(selectUser),
    autoLoggingInState: useAppSelector(selectAutoLoggingInState),
    loggedOutSuccessfully: useAppSelector(selectLoggedOutSuccessfully),
    children: ownProps.children,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  children: React.ReactNode;
};
