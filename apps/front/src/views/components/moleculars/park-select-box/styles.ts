import { SxProps } from '@mui/material';
import { grey, red, blue } from '@mui/material/colors';
import { Park } from 'types/park';

export function style(park: Park): SxProps {
  const switchColor = park === 'L' ? red[700] : blue[700];

  return {
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: grey[500],
    borderRadius: 2,
    padding: 1,
    '& .MuiSwitch-thumb': {
      backgroundColor: switchColor,
    },
    '& .MuiSwitch-track': {
      backgroundColor: switchColor,
    },
  };
}
