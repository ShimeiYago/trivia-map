import { Renderer } from './renderer';
import usePageTracking from 'tracker';
import { useParams } from 'react-router-dom';
import { throwError } from 'store/global-error/slice';
import { useAppDispatch } from 'store';
import { CATEGORIES } from 'constant';

export function CategoryPage() {
  const dispatch = useAppDispatch();

  usePageTracking();

  const { categoryId } = useParams();
  const categoryIdNumber = Number(categoryId);

  if (!categoryIdNumber) {
    dispatch(throwError(404));
  }

  for (const category of CATEGORIES) {
    if (category.categoryId === categoryIdNumber) {
      return <Renderer categoryId={categoryIdNumber} />;
    }
  }

  dispatch(throwError(404));
  return null;
}
