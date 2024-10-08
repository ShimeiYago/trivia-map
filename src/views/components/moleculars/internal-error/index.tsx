import { Box, Typography } from '@mui/material';
import { Image } from 'views/components/moleculars/image';
import logoImage from 'images/logo-blue.png';
import { MAP_PAGE_LINK } from 'constant/links';

export function InternalError(props: { timeout?: boolean }): JSX.Element {
  return (
    <Typography align="center" component="div" sx={{ mt: 3 }}>
      <Box sx={{ mb: 5 }}>
        <Image src={logoImage} width="200px" />
      </Box>

      <Typography component="h1" fontSize={18}>
        {props.timeout ? '通信エラー発生しました。' : 'エラーが発生しました。'}
      </Typography>
      <Typography fontSize={18}>
        {props.timeout
          ? '通信環境が良いところでもう一度お試しください。'
          : 'しばらく時間を空けてからもう一度お試しください。'}
      </Typography>
      <Typography fontSize={20} sx={{ mt: 3 }}>
        <a href={MAP_PAGE_LINK}>トップへ戻る</a>
      </Typography>
    </Typography>
  );
}
