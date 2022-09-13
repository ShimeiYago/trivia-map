import React from 'react';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

export class BackToNavi extends React.Component<Props> {
  render() {
    return (
      <NonStyleLink to={this.props.link}>
        <IconAndText
          iconComponent={<KeyboardArrowLeftIcon />}
          text={this.props.text}
          align="left"
          iconPosition="left"
        />
      </NonStyleLink>
    );
  }
}

export type Props = {
  text: string;
  link: string;
};
