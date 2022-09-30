import { Props, Renderer } from './renderer';
import { throwError } from 'store/global-error/slice';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'store';
import { Helmet } from 'react-helmet-async';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { PAGE_NAMES } from 'constant/page-names';

export function VerifyEmail() {
  const dispatch = useAppDispatch();

  const { verifyKey } = useParams();
  // TODO
  if (!verifyKey) {
    throw Error;
  }

  const props: Props = {
    verifyKey: verifyKey,
    throwError: (status: number) => dispatch(throwError(status)),
  };

  return (
    <>
      <Helmet>
        <title>{pageTitleGenerator(PAGE_NAMES.verifyEmail)}</title>
      </Helmet>

      <Renderer {...props} />
    </>
  );
}
