export function globalAPIErrorMessage(
  status: number,
  method: 'get' | 'submit' | 'delete',
): string {
  const prefix =
    method === 'get'
      ? 'データの取得に失敗しました。'
      : 'エラーが発生しました。';

  switch (status) {
    case 401:
      return `${prefix}ログインが正常に行われているか確認してください。またはしばらく時間を空けてからもう一度お試しください。`;
    case 404:
      return `${prefix}対象のデータは既に削除されている可能性があります。`;
    case 400:
    case 500:
      return `${prefix}しばらく時間を空けてからもう一度お試しください。`;
    default:
      return prefix;
  }
}
