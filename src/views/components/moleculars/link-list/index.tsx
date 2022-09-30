import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export const LinkList: React.FC<Props> = (props) => {
  const links = props.list.map((item, index) => (
    <NonStyleLink to={item.link} key={`account-setting-${index}`}>
      <ListItem>
        <ListItemButton>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
          <ListItemIcon>
            <KeyboardArrowRightIcon />
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    </NonStyleLink>
  ));

  return <List>{links}</List>;
};

export type Props = {
  list: LinkItem[];
};

type LinkItem = {
  icon: React.ReactNode;
  text: string;
  link: string;
};
