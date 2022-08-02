import { Props, Renderer } from './renderer';
import { useParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

export function Article() {
  const { postId } = useParams();
  // TODO
  if (!postId) {
    throw Error;
  }

  // TODO: If postId is not number??
  const props: Props = {
    postId: Number(postId),
    isMobile: isMobile,
  };

  return <Renderer {...props} />;
}
