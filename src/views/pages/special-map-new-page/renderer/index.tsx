/* istanbul ignore file */

import { Box } from '@mui/material';
import { SPECIAL_MAP_EDIT_PAGE_LINK, SPECIAL_MAP_LIST_PAGE_LINK } from 'constant/links';
import { PAGE_NAMES } from 'constant/page-names';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { BackToNavi } from 'views/components/moleculars/back-to-navi';
import { SingleRowPageWrapper } from 'views/components/moleculars/single-row-page-wrapper';
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
      <SingleRowPageWrapper>
        <Box>
          <BackToNavi text={PAGE_NAMES.specialMap} link={SPECIAL_MAP_LIST_PAGE_LINK} />
        </Box>
        <SpecialMapSettingForm />
      </SingleRowPageWrapper>
    );
  }
}

export type Props = {
  specialMapId?: number;
  initializeForm: () => void;
  isMobile: boolean;
};

export type State = {
  specialMapIdForRedirect?: number;
};
