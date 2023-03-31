import { Renderer } from './renderer';
import usePageTracking from 'helper-components/tracker';
import { useParams } from 'react-router-dom';
import { throwError } from 'store/global-error/slice';
import { useAppDispatch } from 'store';
import { CATEGORIES } from 'constant';
import { CommonHelmet } from 'helper-components/common-helmet';
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
      const categoryName = categoryMapper(categoryIdNumber);
      const pageName = `${categoryName}の記事一覧`;
      const description = `${categoryName}の全記事を確認することができます。`;
      return (
        <>
          <CommonHelmet title={pageName} description={description} />

          <Renderer categoryId={categoryIdNumber} />
        </>
      );
    }
  }

  dispatch(throwError(404));
  return null;
}
