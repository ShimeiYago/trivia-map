import { globalAPIErrorMessage } from 'constant-words/global-api-error-message';

describe('globalAPIErrorMessage with get mode', () => {
  it('return message for 401', () => {
    const message = globalAPIErrorMessage(401, 'get');
    expect(message).toBe(
      'データの取得に失敗しました。ログインが正常に行われているか確認してください。またはしばらく時間を空けてからもう一度お試しください。',
    );
  });

  it('return message for 404', () => {
    const message = globalAPIErrorMessage(404, 'get');
    expect(message).toBe(
      'データの取得に失敗しました。対象のデータは既に削除されている可能性があります。',
    );
  });

  it('return message for 400 or 500', () => {
    const message400 = globalAPIErrorMessage(400, 'get');
    const message500 = globalAPIErrorMessage(500, 'get');
    expect(message400).toBe(
      'データの取得に失敗しました。しばらく時間を空けてからもう一度お試しください。',
    );
    expect(message500).toBe(message400);
  });

  it('return message for other status', () => {
    const message = globalAPIErrorMessage(501, 'get');
    expect(message).toBe('データの取得に失敗しました。');
  });
});

describe('globalAPIErrorMessage with submit mode', () => {
  it('return message for 401', () => {
    const message = globalAPIErrorMessage(401, 'submit');
    expect(message).toBe(
      'エラーが発生しました。ログインが正常に行われているか確認してください。またはしばらく時間を空けてからもう一度お試しください。',
    );
  });
});
