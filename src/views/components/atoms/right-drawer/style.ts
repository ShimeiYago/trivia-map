import { SxProps } from '@mui/material';
import { mapPageStyleConst } from 'views/common-styles/map-page';

const { drawerWidth } = mapPageStyleConst;

export const rightDrawerStyle: SxProps = {
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
};

export const formHeader: SxProps = {
  width: '100%',
  backgroundColor: 'white',
  display: 'block',
  pl: 1,
  pt: 1,
};
