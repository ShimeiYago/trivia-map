import { categoryMapper } from '../';

describe('categoryMapper', () => {
  it('return categoryName corresponding to categoryId', async () => {
    const response = categoryMapper(1);
    expect(response).toBe('隠れミッキー');
  });

  it('return default categoryName if categoryId is unexpected', async () => {
    const response = categoryMapper(100);
    expect(response).toBe('その他');
  });
});
