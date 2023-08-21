import { SPECIAL_MAP_EDIT_PAGE_LINK } from 'constant/links';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalMenu } from 'views/components/organisms/global-menu';

// eslint-disable-next-line @typescript-eslint/ban-types
export class Renderer extends React.Component<{}, State> {
  state: State = {};

  render() {
    if (this.state.specialMapIdForRedirect) {
      return (
        <Navigate to={SPECIAL_MAP_EDIT_PAGE_LINK(String(this.state.specialMapIdForRedirect))} />
      );
    }

    return <GlobalMenu topBarPosition="static">xxx</GlobalMenu>;
  }
}

export type State = {
  specialMapIdForRedirect?: number;
};
