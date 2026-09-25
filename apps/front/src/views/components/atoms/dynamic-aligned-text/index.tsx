import { Grid, Typography, TypographyProps } from '@mui/material';

export function DynamicAlignedText(props: Props): JSX.Element {
  return (
    <Grid container justifyContent="center">
      <Grid item>
        <Typography {...props} />
      </Grid>
    </Grid>
  );
}

export type Props = TypographyProps & {
  component?: React.ElementType;
};
