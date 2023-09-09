import { Renderer } from './renderer';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';
import { PAGE_DESCRIPTIONS } from 'constant/head-tags';
import { useAppDispatch, useAppSelector } from 'store';
import { initialize } from 'store/special-map-setting/actions';
import { selectSpecialMapId } from 'store/special-map-setting/selector';
import { isMobile } from 'react-device-detect';
import { pageTitleGenerator } from 'utils/page-title-generator';

export const SpecialMapNewPage = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <CommonHelmet
        title={pageTitleGenerator(PAGE_NAMES.specialMapNew)}
        description={PAGE_DESCRIPTIONS.specialMapNew}
      />

      <Renderer
        specialMapId={useAppSelector(selectSpecialMapId)}
        initializeForm={() => dispatch(initialize())}
        isMobile={isMobile}
      />
    </>
  );
};
