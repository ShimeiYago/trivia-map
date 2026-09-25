import { CATEGORIES } from '../../constant';

export function categoryMapper(categoryId: number) {
  for (const category of CATEGORIES) {
    if (category.categoryId === categoryId) {
      return category.categoryName;
    }
  }

  return CATEGORIES[CATEGORIES.length - 1].categoryName;
}
