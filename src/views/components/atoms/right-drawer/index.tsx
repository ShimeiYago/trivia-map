/* istanbul ignore file */

import { Box, Drawer } from '@mui/material';
import { formHeader, rightDrawerStyle } from './style';
import { CloseFormButton } from 'views/components/organisms/close-form-button';

export const RightDrawer: React.FC<Props> = (props: Props) => {
  return (
    <Drawer sx={rightDrawerStyle} variant="persistent" anchor="right" open={props.open}>
      {props.open && (
        <>
          <Box sx={formHeader}>
            <CloseFormButton onClose={props.onClose} />
          </Box>
          <Box sx={{ overflowY: 'scroll' }}>{props.children}</Box>
        </>
      )}
    </Drawer>
  );
};

export type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
