import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectGlobalErrorStatus } from 'store/global-error/selector';
import { resetErrorStatus } from 'store/global-error/slice';

export function GlobalErrorHandler(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    errorStatus: useAppSelector(selectGlobalErrorStatus),

    children: ownProps.children,
    resetErrorStatus: () => dispatch(resetErrorStatus()),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  children: React.ReactNode;
};
