import { Renderer } from './renderer';
import { useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';
import { Helmet } from 'react-helmet-async';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { PAGE_NAMES } from 'constant/page-names';

export function InquiryPage() {
  const user = useAppSelector(selectUser);

  return (
    <>
      <Helmet>
        <title>{pageTitleGenerator(PAGE_NAMES.inquiry)}</title>
      </Helmet>

      <Renderer user={user} />
    </>
  );
}
