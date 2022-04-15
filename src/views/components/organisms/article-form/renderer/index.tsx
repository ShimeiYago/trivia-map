import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';
import { FormError } from 'store/article-form/model';
import { LoadingButton } from '@mui/lab';
import { miniMapLayer, miniMapTextBox, miniMapWrapper } from './styles';
import { TriviaMap } from '../../trivia-map';
import { BoxField } from 'views/components/atoms/box-field';
import { UpdateFormFieldParam } from 'store/article-form/actions';

export class Renderer extends React.Component<Props> {
  messageRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    if (!props.isFormEditting) {
      this.props.initialize();
    }
    this.messageRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.postId && !this.props.isFormEditting) {
      this.props.fetchArticle(this.props.postId);
    }

    this.props.updateIsEditting(true);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.submittingState !== this.props.submittingState &&
      this.props.submittingState === 'error'
    ) {
      this.messageRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    if (this.props.postId && prevProps.postId !== this.props.postId) {
      this.props.initialize();
      this.props.fetchArticle(this.props.postId);
    }
  }

  componentWillUnmount() {
    if (!this.props.isFormEditting) {
      this.props.initialize();
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
      submittingState === 'loading' || fetchingState === 'loading';

    const miniMapFieldStatus = !!formError?.fieldErrors?.position
      ? 'error'
      : position
      ? 'valid'
      : 'normal';

    return (
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography component="h2" align="center" variant="h4">
            {newMode ? '新しいトリビアを追加' : 'トリビアを編集'}
          </Typography>

          {fetchingState === 'loading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          )}

          {this.renderHeaderError()}

          <TextField
            label="タイトル"
            variant="standard"
            value={title}
            onChange={this.handleChangeTitle}
            disabled={disabled}
            error={!!formError?.fieldErrors?.title}
            helperText={formError?.fieldErrors?.title}
          />

          <TextField
            label="説明文"
            multiline
            rows={4}
            value={content}
            onChange={this.handleChangeContent}
            disabled={disabled}
            error={!!formError?.fieldErrors?.content}
            helperText={formError?.fieldErrors?.content}
          />

          <BoxField
            status={miniMapFieldStatus}
            onClick={handleClickSelectPosition}
            disabled={disabled}
            helperText={formError?.fieldErrors?.position}
          >
            <Box sx={miniMapWrapper}>
              <TriviaMap
                height={300}
                initZoom={3}
                initCenter={position}
                disabled
                doNotShowMarkers
              />
              <Box sx={miniMapLayer}></Box>
              <Box sx={miniMapTextBox}>
                {!disabled && (
                  <Typography
                    color="white"
                    textAlign="center"
                    component="div"
                    fontSize="14"
                    variant="inherit"
                  >
                    {this.getMiniMapText()}
                  </Typography>
                )}
              </Box>
            </Box>
          </BoxField>

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
    this.props.updateFormField({ title: e.target.value });

  protected handleChangeContent = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.props.updateFormField({ content: e.target.value });

  protected handleSubmitButton = () => {
    if (this.props.postId) {
      return this.props.submitEdittedArticle();
    } else {
      return this.props.submitNewArticle();
    }
  };

  protected getMiniMapText() {
    if (this.props.position) {
      return (
        <>
          この位置が選択されています。
          <br />
          位置を選び直す場合はここをタップしてください。
        </>
      );
    }

    return (
      <>
        位置が選択されていません。
        <br />
        ここをタップして位置を選択してください。
      </>
    );
  }

  protected renderHeaderError() {
    const { formError } = this.props;

    if (!formError) {
      return null;
    }

    return (
      <Alert severity="error" ref={this.messageRef}>
        <AlertTitle>{formError.errorTitle}</AlertTitle>
        {formError.headerErrors?.map((msg: string, index: number) => (
          <li key={`headerErrors-${index}`}>{msg}</li>
        ))}
      </Alert>
    );
  }
}

export type Props = {
  postId?: string;
  title: string;
  content: string;
  position?: Position;
  submittingState: LoadingState;
  fetchingState: LoadingState;
  formError?: FormError;
  isFormEditting: boolean;

  updateFormField: (param: UpdateFormFieldParam) => void;
  submitNewArticle: () => void;
  submitEdittedArticle: () => void;
  fetchArticle: (postId: string) => void;
  initialize: () => void;
  handleClickSelectPosition?: () => void;
  updateIsEditting: (isEditting: boolean) => void;
};
