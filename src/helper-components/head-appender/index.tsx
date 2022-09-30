import React, { useEffect } from 'react';

export function HeadAppender(props: Props): JSX.Element {
  useEffect(() => {
    document.title = props.title;
  });

  return <>{props.children}</>;
}

export type Props = {
  title: string;
  children: React.ReactNode;
};
