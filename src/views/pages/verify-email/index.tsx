import { Props, Renderer } from './renderer';
import { throwError } from 'store/global-error/slice';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'store';
import { CommonHelmet } from 'helper-components/common-helmet';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { PAGE_NAMES } from 'constant/page-names';

export function VerifyEmail() {
  const dispatch = useAppDispatch();

  const { verifyKey } = useParams();

  if (verifyKey === undefined) {
    throw Error('verifyKey is undefined');
  }

  const props: Props = {
    verifyKey: verifyKey,
    throwError: (status: number) => dispatch(throwError(status)),
  };

  return (
    <>
      <CommonHelmet title={pageTitleGenerator(PAGE_NAMES.verifyEmail)} noindex />

      <Renderer {...props} />
    </>
  );
}
