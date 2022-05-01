import { Props, Renderer } from './renderer';
// import { useAppSelector, useAppDispatch } from 'store';

export function GlobalMenu(ownProps: OwnProps) {
  // const dispatch = useAppDispatch();

  const props: Props = {
    topBarPosition: ownProps.topBarPosition,
    children: ownProps.children,
    permanentLeftNavi: ownProps.permanentLeftNavi,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  topBarPosition: 'static' | 'fixed';
  children: React.ReactNode;
  permanentLeftNavi?: boolean;
};
