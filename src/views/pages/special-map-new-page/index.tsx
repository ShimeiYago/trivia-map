import { Renderer } from './renderer';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';
import { PAGE_DESCRIPTIONS, SUB_SITE_IMAGES } from 'constant/head-tags';
import { useAppDispatch, useAppSelector } from 'store';
import { initialize } from 'store/special-map-setting/actions';
import { selectSpecialMapId } from 'store/special-map-setting/selector';
import { isMobile } from 'react-device-detect';
import { getDomain } from 'utils/get-domain.ts';

export const SpecialMapNewPage = () => {
  const dispatch = useAppDispatch();

  const domain = getDomain(window);

  return (
    <>
      <CommonHelmet
        title={PAGE_NAMES.specialMapNew}
        description={PAGE_DESCRIPTIONS.specialMapNew}
        imageUrl={`${domain}/${SUB_SITE_IMAGES.specialMap}`}
      />

      <Renderer
        specialMapId={useAppSelector(selectSpecialMapId)}
        initializeForm={() => dispatch(initialize())}
        isMobile={isMobile}
      />
    </>
  );
};
