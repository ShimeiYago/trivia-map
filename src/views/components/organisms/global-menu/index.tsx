import { Props, Renderer } from './renderer';

// import { useAppSelector, useAppDispatch } from 'store';

export function GlobalMenu(ownProps: OwnProps) {
  // const dispatch = useAppDispatch();

  const props: Props = {
    barPosition: ownProps.barPosition,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  barPosition: 'static' | 'fixed';
};
