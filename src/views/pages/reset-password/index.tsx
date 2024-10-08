import { PAGE_NAMES } from 'constant/page-names';
import { CommonHelmet } from 'helper-components/common-helmet';
import { useParams } from 'react-router-dom';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { Renderer, Props } from './renderer';

export function ResetPassword() {
  const { uid, token } = useParams();

  if (uid === undefined || token === undefined) {
    throw Error('uid or token is not provided');
  }

  const props: Props = {
    uid: uid,
    token: token,
  };

  return (
    <>
      <CommonHelmet title={pageTitleGenerator(PAGE_NAMES.passwordInitialize)} noindex />

      <Renderer {...props} />
    </>
  );
}
