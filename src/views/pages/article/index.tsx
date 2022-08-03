import { Props, Renderer } from './renderer';
import { Navigate, useParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { NOT_FOUND_LINK } from 'constant/links';

export function Article() {
  const { postId } = useParams();
  const postIdNumber = Number(postId);

  if (!postIdNumber) {
    return <Navigate to={NOT_FOUND_LINK} />;
  }

  const props: Props = {
    postId: postIdNumber,
    isMobile: isMobile,
  };

  return <Renderer {...props} />;
}
