import React from 'react';
import { Box, Container, Stack, TextField, Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';
import { FormError } from 'store/article-form/model';
import { LoadingButton } from '@mui/lab';
import { positionBoxStyle } from './styles';

export class Renderer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    if (!props.resume) {
      this.props.initialize();
    }
  }

  componentDidMount() {
    if (this.props.postId && !this.props.resume) {
      this.props.fetchArticle(this.props.postId);
    }
  }

  render() {
    const {
      postId,
      title,
      content,
      position,
      submittingState,
      fetchingState,
      formError,
      handleClickSelectPosition,
    } = this.props;

    const newMode = !postId;

    const disabled =
      submittingState === 'loading' ||
      fetchingState === 'loading' ||
      fetchingState === 'error';

    // TODO: show validaiton error meseages on textfield
    return (
      <Container maxWidth="sm" sx={{ pt: 5 }}>
        <Stack spacing={3}>
          <Typography component="h2" align="center" variant="h4">
            {newMode ? '新しいトリビアを追加' : 'トリビアを編集'}
          </Typography>

          <TextField
            label="タイトル"
            variant="standard"
            value={title}
            onChange={this.handleChangeTitle}
            disabled={disabled}
            error={!!formError?.fieldErrors?.title}
          />

          <TextField
            label="説明文"
            multiline
            rows={4}
            value={content}
            onChange={this.handleChangeContent}
            disabled={disabled}
            error={!!formError?.fieldErrors?.content}
          />

          <Box sx={positionBoxStyle} onClick={handleClickSelectPosition}>
            {JSON.stringify(position)}
          </Box>

          <LoadingButton
            loading={submittingState === 'loading'}
            variant="outlined"
            disabled={disabled}
            onClick={this.handleSubmitButton}
          >
            保存して公開
          </LoadingButton>
        </Stack>
      </Container>
    );
  }

  protected handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.props.updateTitle(e.target.value);

  protected handleChangeContent = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.props.updateContent(e.target.value);

  protected handleSubmitButton = () => {
    if (this.props.postId) {
      return this.props.submitEdittedArticle();
    } else {
      return this.props.submitNewArticle();
    }
  };
}

export type Props = {
  postId?: string;
  title: string;
  content: string;
  position: Position;
  submittingState: LoadingState;
  fetchingState: LoadingState;
  formError?: FormError;
  resume: boolean;

  updateTitle: (title: string) => void;
  updateContent: (content: string) => void;
  updatePosition: (position: Position) => void;
  submitNewArticle: () => void;
  submitEdittedArticle: () => void;
  fetchArticle: (postId: string) => void;
  initialize: () => void;
  handleClickSelectPosition?: () => void;
};
