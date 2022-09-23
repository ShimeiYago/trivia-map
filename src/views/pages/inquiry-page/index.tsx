import { Renderer } from './renderer';
import { useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';

export function InquiryPage() {
  const user = useAppSelector(selectUser);

  return <Renderer user={user} />;
}
