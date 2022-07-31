import React from 'react';
import { Link } from 'react-router-dom';

export const NonStyleLink: React.FC<Props> = (props) => {
  return (
    <Link to={props.to} style={{ color: 'inherit', textDecoration: 'none' }}>
      {props.children}
    </Link>
  );
};

export type Props = {
  children: React.ReactNode;
  to: string;
};
