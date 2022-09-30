import { PAGE_NAMES } from 'constant/page-names';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { Renderer, Props } from './renderer';

export function ResetPassword() {
  const { uid, token } = useParams();
  // TODO
  if (!uid || !token) {
    throw Error;
  }

  const props: Props = {
    uid: uid,
    token: token,
  };

  return (
    <>
      <Helmet>
        <title>{pageTitleGenerator(PAGE_NAMES.passwordInitialize)}</title>
      </Helmet>

      <Renderer {...props} />
    </>
  );
}
