import { Props, Renderer } from './renderer';
import { useParams } from 'react-router-dom';

export function VerifyEmail() {
  const { verifyKey } = useParams();
  // TODO
  if (!verifyKey) {
    throw Error;
  }

  const props: Props = {
    verifyKey: verifyKey,
  };

  return <Renderer {...props} />;
}
