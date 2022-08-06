import { Props, Renderer } from './renderer';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';
import { PreviewKeyType } from 'api/articles-api/get-articles-previews';

export function ArticleList(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const { keyId } = useParams();
  const keyIdNumber = Number(keyId);

  if (!keyIdNumber) {
    dispatch(throwError(404));
  }

  const props: Props = {
    type: ownProps.type,
    keyId: keyIdNumber,

    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  type: PreviewKeyType;
};
