import { Renderer } from './renderer';
import { useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';
import { CommonHelmet } from 'helper-components/common-helmet';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { PAGE_NAMES } from 'constant/page-names';

export function InquiryPage() {
  const user = useAppSelector(selectUser);

  return (
    <>
      <CommonHelmet title={pageTitleGenerator(PAGE_NAMES.inquiry)} />

      <Renderer user={user} />
    </>
  );
}
