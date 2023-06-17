import { globalAPIErrorMessage } from 'constant/global-api-error-message';

describe('globalAPIErrorMessage with get mode', () => {
  it('return message for 400', () => {
    const message = globalAPIErrorMessage(400, 'get');
    expect(message).toBe('入力内容に誤りがあります。');
  });

  it('return message for 401', () => {
    const message = globalAPIErrorMessage(401, 'get');
    expect(message).toBe(
      'データの取得に失敗しました。ログインが正常に行われているか確認してください。',
    );
  });

  it('return message for 403', () => {
    const message = globalAPIErrorMessage(403, 'get');
    expect(message).toBe('データの取得に失敗しました。正しいアカウントでログインしてください。');
  });

  it('return message for 404', () => {
    const message = globalAPIErrorMessage(404, 'get');
    expect(message).toBe(
      'データの取得に失敗しました。対象のデータは既に削除されている可能性があります。',
    );
  });

  it('return message for 500', () => {
    const message = globalAPIErrorMessage(500, 'get');
    expect(message).toBe(
      'データの取得に失敗しました。しばらく時間を空けてからもう一度お試しください。',
    );
  });

  it('return message for 408', () => {
    const message = globalAPIErrorMessage(408, 'get');
    expect(message).toBe(
      'データの取得に失敗しました。通信環境が良いところでもう一度お試しください。',
    );
  });

  it('return message for other status', () => {
    const message = globalAPIErrorMessage(501, 'get');
    expect(message).toBe('データの取得に失敗しました。');
  });
});

describe('globalAPIErrorMessage with submit mode', () => {
  it('return message for 401', () => {
    const message = globalAPIErrorMessage(401, 'submit');
    expect(message).toBe('エラーが発生しました。ログインが正常に行われているか確認してください。');
  });
});
