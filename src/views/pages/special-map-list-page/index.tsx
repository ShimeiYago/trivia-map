import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import usePageTracking from 'helper-components/tracker';
import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';
import { useNavigate } from 'react-router-dom';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';
import { PAGE_DESCRIPTIONS } from 'constant/head-tags';

export function SpecialMapListPage() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  usePageTracking();

  const props: Props = {
    isMobile: isMobile,

    navigate: (to: string) => navigate(to),
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return (
    <>
      <CommonHelmet title={PAGE_NAMES.specialMap} description={PAGE_DESCRIPTIONS.specialMaps} />
      <Renderer {...props} />
    </>
  );
}
