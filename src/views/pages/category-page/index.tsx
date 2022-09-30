import { Renderer } from './renderer';
import usePageTracking from 'helper-components/tracker';
import { useParams } from 'react-router-dom';
import { throwError } from 'store/global-error/slice';
import { useAppDispatch } from 'store';
import { CATEGORIES } from 'constant';
import { Helmet } from 'react-helmet-async';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { categoryMapper } from 'utils/category-mapper';

export function CategoryPage() {
  const dispatch = useAppDispatch();

  usePageTracking();

  const { categoryId } = useParams();
  const categoryIdNumber = Number(categoryId);

  if (categoryIdNumber !== 0 && !categoryIdNumber) {
    dispatch(throwError(404));
  }

  for (const category of CATEGORIES) {
    if (category.categoryId === categoryIdNumber) {
      return (
        <>
          <Helmet>
            <title>{pageTitleGenerator(categoryMapper(categoryIdNumber))}</title>
          </Helmet>

          <Renderer categoryId={categoryIdNumber} />
        </>
      );
    }
  }

  dispatch(throwError(404));
  return null;
}
