import { useParams } from 'react-router-dom';
import { Renderer, Props } from './renderer';

export function ResetPassword() {
  const { uid, token } = useParams();
  // TODO
  if (!uid || !token) {
    throw Error;
  }

  const props: Props = {
    uid: uid,
    token: token,
  };

  return <Renderer {...props} />;
}
