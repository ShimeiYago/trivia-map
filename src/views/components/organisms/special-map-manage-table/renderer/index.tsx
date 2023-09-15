/* istanbul ignore file */

import React from 'react';
import { Typography, Snackbar, Alert } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import {
  SPECIAL_MAP_EDIT_PAGE_LINK,
  SPECIAL_MAP_MANAGE_PAGE_LINK,
  SPECIAL_MAP_NEW_PAGE_LINK,
  SPECIAL_MAP_PAGE_LINK,
} from 'constant/links';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { getUrlParameters } from 'utils/get-url-parameters';
import {
  GetSpecialMapsResponseWithPagination,
  getSpecialMaps,
} from 'api/special-map-api/get-special-maps';
import { ManageTable, ManageTableContent } from 'views/components/moleculars/manage-table';
import { deleteSpecialMap } from 'api/special-map-api/delete-special-map';
import { Link } from 'react-router-dom';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: 'waiting',
      deleting: false,
      searchParam: props.initSearchParam,
    };
  }

  componentDidMount() {
    this.fetchSpecialMapsPreviews();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (JSON.stringify(prevState.searchParam) !== JSON.stringify(this.state.searchParam)) {
      const urlParameters = getUrlParameters(this.state.searchParam);
      history.replaceState('', '', `${SPECIAL_MAP_MANAGE_PAGE_LINK}${urlParameters}`);
    }
  }

  render() {
    return (
      <>
        {this.renderTable()}
        {this.renderMessage()}
      </>
    );
  }

  renderTable() {
    const { loadingState, specialMapPreviews } = this.state;
    if (loadingState === 'waiting' || loadingState === 'loading' || !specialMapPreviews) {
      return <CenterSpinner />;
    }

    if (specialMapPreviews.results.length === 0) {
      return (
        <Typography align="center" component="div">
          <Typography component="div" mb={1}>
            まだ記事が投稿されていません。
          </Typography>
          <Link to={SPECIAL_MAP_NEW_PAGE_LINK}>新しいオリジナルマップを作成する</Link>
        </Typography>
      );
    }

    const contents: ManageTableContent[] = specialMapPreviews.results.map((preview) => {
      return {
        title: preview.title,
        isDraft: !preview.isPublic,
        image: preview.thumbnail,
        viewLink: SPECIAL_MAP_PAGE_LINK(String(preview.specialMapId)),
        editLink: SPECIAL_MAP_EDIT_PAGE_LINK(String(preview.specialMapId)),
        onDelete: this.deleteSpecialMap(preview.specialMapId, preview.title),
      };
    });

    return (
      <ManageTable
        isMobile={this.props.isMobile}
        pagination={specialMapPreviews}
        onChangePagination={this.handleChangePagination}
        contents={contents}
        getDraftText={this.getDraftText}
        deleting={this.state.deleting}
        hideCategory
        hideNumberOfGoods
      />
    );
  }

  protected getDraftText(isDraft: boolean) {
    return isDraft ? '非公開' : '公開中';
  }

  protected renderMessage() {
    if (!this.state.message) {
      return null;
    }

    return (
      <Snackbar open={true} autoHideDuration={6000} onClose={this.handleCloseMessage}>
        <Alert
          onClose={this.handleCloseMessage}
          severity={this.state.message.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {this.state.message.text}
        </Alert>
      </Snackbar>
    );
  }

  protected async fetchSpecialMapsPreviews() {
    this.setState({
      loadingState: 'loading',
      specialMapPreviews: undefined,
    });

    try {
      const res = await autoRefreshApiWrapper(
        () => getSpecialMaps(this.state.searchParam, { mine: true }),
        this.props.refreshUser,
      );

      this.setState({
        loadingState: 'success',
        specialMapPreviews: res,
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      this.props.throwError(apiError.status);
    }
  }

  protected handleChangePagination = (event: React.ChangeEvent<unknown>, page: number) => {
    this.setState(
      {
        searchParam: {
          ...this.state.searchParam,
          page,
        },
      },
      this.fetchSpecialMapsPreviews,
    );
  };

  protected deleteSpecialMap = (postId: number, title: string) => async () => {
    const { refreshUser } = this.props;

    this.setState({
      message: undefined,
      deleting: true,
    });

    try {
      await autoRefreshApiWrapper(() => deleteSpecialMap(postId), refreshUser);

      this.setState({
        message: {
          text: `「${title}」を削除しました。`,
          type: 'success',
        },
        deleting: false,
      });
      this.fetchSpecialMapsPreviews();
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      this.setState({
        message: {
          text: globalAPIErrorMessage(apiError.status, 'delete'),
          type: 'error',
        },
        deleting: false,
      });
    }
  };

  protected handleCloseMessage = () => {
    this.setState({
      message: undefined,
    });
  };
}

export type Props = {
  isMobile: boolean;
  initSearchParam: { page?: number };
  throwError: (status: number) => void;
  refreshUser: () => void;
};

export type State = {
  loadingState: LoadingState;
  searchParam: { page?: number };
  deleting: boolean;
  specialMapPreviews?: GetSpecialMapsResponseWithPagination;
  message?: {
    text: string;
    type: 'error' | 'success';
  };
};
