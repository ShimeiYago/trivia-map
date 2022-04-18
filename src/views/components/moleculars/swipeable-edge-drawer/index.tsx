import React, { ReactNode } from 'react';
import { Box, SwipeableDrawer, Typography } from '@mui/material';
import { contentStyle, edgeLabelStyle, headStyle, pullerStyle } from './styles';
import { Global } from '@emotion/react';

export class SwipeableEdgeDrawer extends React.Component<Props> {
  static readonly defaultProps = {
    bleedingHeight: 56,
    heightRatio: 50,
    show: false,
  };

  render() {
    const {
      show,
      open,
      onOpen,
      onClose,
      bleedingHeight,
      children,
      edgeLabel,
      edgeLabelWhenClosed,
      heightRatio,
    } = this.props;

    if (!show) {
      return null;
    }

    const edge = edgeLabelWhenClosed && !open ? edgeLabelWhenClosed : edgeLabel;

    return (
      <>
        <Global
          styles={{
            '.MuiDrawer-root > .MuiPaper-root': {
              height: `calc(${heightRatio}% - ${bleedingHeight}px)`,
              overflow: 'visible',
            },
          }}
        />
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={onClose}
          onOpen={onOpen}
          swipeAreaWidth={bleedingHeight}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Box sx={headStyle(bleedingHeight)}>
            {this.renderPuller()}
            <Typography sx={edgeLabelStyle}>{edge}</Typography>
          </Box>
          <Box sx={contentStyle}>{children}</Box>
        </SwipeableDrawer>
      </>
    );
  }

  protected renderPuller() {
    return <Box sx={pullerStyle}></Box>;
  }
}

export type Props = {
  show: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  bleedingHeight: number;
  heightRatio: number;
  children: ReactNode;
  edgeLabel: ReactNode;
  edgeLabelWhenClosed?: ReactNode;
};
