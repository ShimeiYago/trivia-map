import { Renderer } from './renderer';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_NAMES } from 'constant/page-names';
import { LOGIN_LINK } from 'constant/links';
import { PAGE_DESCRIPTIONS } from 'constant/head-tags';

export const Login = (props: Props) => {
  const pageName = PAGE_NAMES[props.page];

  return (
    <>
      <CommonHelmet
        title={pageName}
        description={PAGE_DESCRIPTIONS.login}
        canonicalUrlPath={LOGIN_LINK}
      />

      <Renderer initialMode={props.page} />
    </>
  );
};

type Props = {
  page: 'login' | 'signup';
};
