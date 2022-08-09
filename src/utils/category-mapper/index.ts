import { CATEGORIES } from '../../constant';

export function categoryMapper(categoryId: number) {
  CATEGORIES.forEach((category) => {
    if (category.categoryId === categoryId) {
      return category.categoryName;
    }
  });

  return CATEGORIES[0].categoryName;
}
