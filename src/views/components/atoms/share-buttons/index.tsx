import { Box } from '@mui/material';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  LineShareButton,
  LineIcon,
} from 'react-share';

export function ShareButtons(props: Props): JSX.Element {
  return (
    <Box textAlign="center">
      <FacebookShareButton url={props.url} title={props.title}>
        <FacebookIcon size={50} round />
      </FacebookShareButton>
      <TwitterShareButton url={props.url} title={props.title}>
        <TwitterIcon size={50} round />
      </TwitterShareButton>
      <LineShareButton url={props.url} title={props.title}>
        <LineIcon size={50} round />
      </LineShareButton>
    </Box>
  );
}

export type Props = {
  url: string;
  title: string;
};
