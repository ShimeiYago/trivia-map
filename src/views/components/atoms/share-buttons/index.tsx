import { Box } from '@mui/material';
import { countByteLength } from 'utils/count-byte-length';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  LineShareButton,
  LineIcon,
} from 'react-share';

// max byte length of twitter
const MAX_BYTE_LENGTH = 280;

export function ShareButtons(props: Props): JSX.Element {
  const title = `【${props.title}】`;

  // "-3" includes
  // - breakline character between title & description
  // - blank between description & url
  // - blank surfix after url
  const descriptionMaxByteLength =
    MAX_BYTE_LENGTH - countByteLength(title) - props.url.length * 2 - 3;
  let descriptionMaxLength = Math.floor(descriptionMaxByteLength / 2);
  let suffix = '';

  // If description length is longer than max, decrease 3 byte and add "..."
  if (props.description.length > descriptionMaxLength) {
    descriptionMaxLength = Math.floor((descriptionMaxByteLength - 3) / 2);
    suffix = '...';
  }

  const text = `${title}\n${props.description.slice(0, descriptionMaxLength)}${suffix}`;

  return (
    <Box textAlign="center">
      <FacebookShareButton url={props.url} title={text}>
        <FacebookIcon size={50} round />
      </FacebookShareButton>
      <TwitterShareButton url={props.url} title={text}>
        <TwitterIcon size={50} round />
      </TwitterShareButton>
      <LineShareButton url={props.url} title={text}>
        <LineIcon size={50} round />
      </LineShareButton>
    </Box>
  );
}

export type Props = {
  url: string;
  title: string;
  description: string;
};
