import { Renderer } from './renderer';
import { useAppSelector } from 'store';
import { selectUser } from 'store/auths/selector';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';
import { PAGE_DESCRIPTIONS, SUB_SITE_IMAGES } from 'constant/head-tags';
import { getDomain } from 'utils/get-domain.ts';

export function InquiryPage() {
  const user = useAppSelector(selectUser);
  const domain = getDomain(window);

  return (
    <>
      <CommonHelmet
        title={PAGE_NAMES.inquiry}
        description={PAGE_DESCRIPTIONS.inquiry}
        imageUrl={`${domain}/${SUB_SITE_IMAGES.inquiry}`}
      />

      <Renderer user={user} />
    </>
  );
}
