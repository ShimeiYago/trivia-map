import { Typography } from '@mui/material';

export function DesignedHead(props: Props) {
  return (
    <Typography
      variant="h5"
      component="h2"
      sx={{
        py: 0.5,
        px: 1,
        borderLeft: 'solid 5px #7db4e6',
        borderBottom: 'solid 2px #7db4e6',
        mt: 1,
        mb: 2,
      }}
    >
      {props.children}
    </Typography>
  );
}

type Props = {
  children: React.ReactNode;
};
