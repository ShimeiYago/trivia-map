import {
  ARTICLE_PAGE_LINK,
  EDIT_LINK,
  RESET_PASSWORD_LINK,
  VERIFY_EMAIL_LINK,
} from '../links';

describe('links', () => {
  it('ARTICLE_PAGE_LINK return article page link', () => {
    const link = ARTICLE_PAGE_LINK('1');
    expect(link).toBe('/article/1');
  });

  it('EDIT_LINK return edit page link', () => {
    const link = EDIT_LINK('1');
    expect(link).toBe('/edit/1');
  });

  it('VERIFY_EMAIL_LINK return verify email page link', () => {
    const link = VERIFY_EMAIL_LINK('xxxxx');
    expect(link).toBe('/verify-email/xxxxx');
  });

  it('RESET_PASSWORD_LINK return verify email page link', () => {
    const link = RESET_PASSWORD_LINK('xxxxx', 'yyyyy');
    expect(link).toBe('/reset-password/xxxxx/yyyyy');
  });
});
