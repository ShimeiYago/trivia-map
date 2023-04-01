import { Renderer } from './renderer';
import { useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';
import { PAGE_DESCRIPTIONS } from 'constant/head-tags';

export function InquiryPage() {
  const user = useAppSelector(selectUser);

  return (
    <>
      <CommonHelmet title={PAGE_NAMES.inquiry} description={PAGE_DESCRIPTIONS.inquiry} />

      <Renderer user={user} />
    </>
  );
}
