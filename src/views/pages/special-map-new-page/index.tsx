import { Renderer } from './renderer';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';
import { PAGE_DESCRIPTIONS } from 'constant/head-tags';

export const SpecialMapNewPage = () => {
  return (
    <>
      <CommonHelmet
        title={PAGE_NAMES.specialMapNew}
        description={PAGE_DESCRIPTIONS.specialMapNew}
      />

      <Renderer />
    </>
  );
};
