import { Renderer } from './renderer';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';
import { PAGE_DESCRIPTIONS } from 'constant/head-tags';
import { useAppDispatch, useAppSelector } from 'store';
import { initialize } from 'store/special-map-setting/actions';
import { selectSpecialMapId } from 'store/special-map-setting/selector';
import { isMobile } from 'react-device-detect';

export const SpecialMapNewPage = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <CommonHelmet
        title={PAGE_NAMES.specialMapNew}
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
