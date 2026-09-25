import { Divider, Paper, Stack, Typography } from '@mui/material';
import { Image } from 'views/components/moleculars/image';
import logoImage from 'images/logo-blue.png';
import {
  ARTICLE_LIST_PAGE_LINK,
  INQUIRY_PAGE_LINK,
  MAP_PAGE_LINK,
  PRIVACY_POLICY_PAGE_LINK,
  TERMS_PAGE_LINK,
} from 'constant/links';
import { Link } from 'react-router-dom';
import { PAGE_NAMES } from 'constant/page-names';

export function Footer(props: Props): JSX.Element {
  const linkList = [
    { to: MAP_PAGE_LINK, text: 'マップ' },
    { to: ARTICLE_LIST_PAGE_LINK, text: PAGE_NAMES.articles },
    { to: INQUIRY_PAGE_LINK, text: PAGE_NAMES.inquiry },
    { to: TERMS_PAGE_LINK, text: PAGE_NAMES.terms },
    { to: PRIVACY_POLICY_PAGE_LINK, text: PAGE_NAMES.privacy },
  ];

  const renderLinks = (links: { to: string; text: string }[]) => {
    return (
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        justifyContent="center"
        component="nav"
        sx={{ fontSize: 14 }}
      >
        {links.map((link) => (
          <Link to={link.to} key={`footer-navi-${link.text}`}>
            {link.text}
          </Link>
        ))}
      </Stack>
    );
  };

  return (
    <Paper elevation={2} square>
      <Stack spacing={3} py={3}>
        <Typography align="center" component="div">
          <Image src={logoImage} width="100px" />
        </Typography>

        {props.isMobile ? (
          <>
            {renderLinks([linkList[0], linkList[1], linkList[2]])}
            {renderLinks([linkList[3], linkList[4]])}
          </>
        ) : (
          renderLinks(linkList)
        )}
      </Stack>
    </Paper>
  );
}

export type Props = {
  isMobile: boolean;
};
