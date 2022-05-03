import { SxProps } from '@mui/material';

export const wrapper: SxProps = {
  backgroundColor: '#f4f5f7',
};

export function contentWrapper(isMobile: boolean): SxProps {
  return {
    marginTop: isMobile ? 1 : 5,
    marginX: isMobile ? 0 : 10,
  };
}

export const mapTitle: SxProps = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  justifyContent: 'center',
};
