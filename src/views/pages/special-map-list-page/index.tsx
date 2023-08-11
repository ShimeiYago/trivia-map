import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';
import { useLocation, useNavigate } from 'react-router-dom';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';
import { PAGE_DESCRIPTIONS } from 'constant/head-tags';

export function SpecialMapListPage() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const search = useLocation().search;
  const query = new URLSearchParams(search);

  const page = query.get('page');

  const props: Props = {
    isMobile: isMobile,
    initialPage: Number(page) ? Number(page) : undefined,

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
