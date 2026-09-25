import { Box, CircularProgress } from '@mui/material';

export const CenterSpinner: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
};
