import { Props, Renderer } from './renderer';
import { useAppSelector, useAppDispatch } from 'store';
import { autoLogin } from 'store/auths/actions';
import { selectUser } from 'store/auths/selector';

export function GlobalMenu(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    topBarPosition: ownProps.topBarPosition,
    children: ownProps.children,
    permanentLeftNavi: ownProps.permanentLeftNavi,
    userInfo: useAppSelector(selectUser),
    autoLogin: () => dispatch(autoLogin()),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  topBarPosition: 'static' | 'fixed';
  children: React.ReactNode;
  permanentLeftNavi?: boolean;
};
