/* istanbul ignore file */

import { Avatar, Stack, Typography } from '@mui/material';
import { Author } from 'types/author';
import { NonStyleLink } from '../non-style-link';
import { AUTHER_PAGE_LINK } from 'constant/links';
import noIcon from 'images/no-icon.jpg';

export function AuthorLink({ author }: Props): JSX.Element {
  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
      <NonStyleLink to={AUTHER_PAGE_LINK(author.userId.toString())}>
        <Avatar sx={{ width: 30, height: 30 }} src={author.icon ?? noIcon} />
      </NonStyleLink>
      <NonStyleLink to={AUTHER_PAGE_LINK(author.userId.toString())}>
        <Typography color="gray" sx={{ textDecoration: 'underline' }}>
          {author.nickname}
        </Typography>
      </NonStyleLink>
    </Stack>
  );
}

export type Props = {
  author: Author;
};
