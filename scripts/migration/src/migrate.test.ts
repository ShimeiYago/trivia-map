import { describe, expect, it } from 'vitest';
import { imageKeys, transform } from './migrate.js';

describe('migration transform', () => {
  it('retains legacy IDs while making Like and Good keys unique by actor and article', () => {
    expect(transform('Likes', { likeId: 9, user_id: 2, article_id: 3 })).toMatchObject({ id: '2#3', likeId: '9', userId: '2', postId: '3' });
    expect(transform('Goods', { goodId: 8, ipAddress: '192.0.2.1', article_id: 3 })).toMatchObject({ goodId: '8', postId: '3', ipHash: expect.stringMatching(/^[a-f0-9]{64}$/) });
  });

  it('creates query attributes for public articles without retaining raw IP addresses', () => {
    expect(transform('Articles', { postId: 4, author_id: 2, marker_id: 1, title: 'title', description: 'body', category: 1, isDraft: 0, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' })).toMatchObject({ id: '4', publicKey: 'public', authorId: '2', markerId: '1' });
  });

  it('includes uploads-backed user media and excludes remote social icons', () => {
    expect(imageKeys({ id: '1', image: 'uploads/articles/image.png', icon: 'uploads/users/icon.png', socialIcon: 'https://example.test/icon.png' })).toEqual(['uploads/articles/image.png', 'uploads/users/icon.png']);
  });
});
