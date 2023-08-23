/* istanbul ignore file */

import { SPECIAL_MAP_EDIT_PAGE_LINK } from 'constant/links';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { SpecialMapSettingForm } from 'views/components/organisms/special-map-setting-form';

export class Renderer extends React.Component<Props, State> {
  state: State = {};

  componentDidMount(): void {
    this.props.initializeForm();
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (!prevProps.specialMapId && this.props.specialMapId) {
      this.setState({
        specialMapIdForRedirect: this.props.specialMapId,
      });
    }
  }

  render() {
    if (this.state.specialMapIdForRedirect) {
      return (
        <Navigate to={SPECIAL_MAP_EDIT_PAGE_LINK(String(this.state.specialMapIdForRedirect))} />
      );
    }

    return (
      <GlobalMenu topBarPosition="static">
        <SpecialMapSettingForm />
      </GlobalMenu>
    );
  }
}

export type Props = {
  specialMapId?: number;
  initializeForm: () => void;
};

export type State = {
  specialMapIdForRedirect?: number;
};
