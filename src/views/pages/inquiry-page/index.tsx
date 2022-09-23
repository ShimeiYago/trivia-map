import { Renderer } from './renderer';
import { isMobile } from 'react-device-detect';
import { useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';

export function InquiryPage() {
  const user = useAppSelector(selectUser);

  return <Renderer isMobile={isMobile} user={user} />;
}
