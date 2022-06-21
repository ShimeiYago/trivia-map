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
import {
  formContainer,
  formHeader,
  miniMapLayer,
  miniMapTextBox,
  miniMapWrapper,
} from './styles';
import { TriviaMap } from '../../trivia-map';
import { BoxField } from 'views/components/moleculars/box-field';
import { UpdateFormFieldParam } from 'store/article-form/actions';
import { CloseFormButton } from '../../close-form-button';
import { ImageField } from 'views/components/moleculars/image-field';
import { DeletableImage } from 'views/components/moleculars/deletable-image';

export class Renderer extends React.Component<Props> {
  headerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    if (!props.isFormEditting) {
      this.props.initialize();
    }
    this.headerRef = React.createRef();
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
      this.headerRef.current?.scrollIntoView({
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
      description,
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
      <>
        {this.renderHeader()}
        <Container maxWidth="sm" sx={formContainer}>
          <Stack spacing={3}>
            <Typography
              component="h2"
              align="center"
              variant="h4"
              ref={this.headerRef}
            >
              {newMode ? '新しいトリビアを追加' : 'トリビアを編集'}
            </Typography>

            {fetchingState === 'loading' && (
              <Box sx={{ display: 'flex', justifydescription: 'center' }}>
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

            {this.props.imageDataUrl ? (
              <DeletableImage
                src={this.props.imageDataUrl}
                width="full"
                height="200px"
                objectFit="cover"
                borderRadius
                onDelete={this.handleDeleteImage}
              />
            ) : (
              <ImageField onChange={this.handleFileInputChange} />
            )}

            <TextField
              label="説明文"
              multiline
              rows={4}
              value={description}
              onChange={this.handleChangeDescription}
              disabled={disabled}
              error={!!formError?.fieldErrors?.description}
              helperText={formError?.fieldErrors?.description}
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
                  doNotShowPostMarkers
                  shouldCurrentPositionAsyncWithForm
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
      </>
    );
  }

  protected renderHeader() {
    if (!this.props.onClose) {
      return null;
    }
    return (
      <Box sx={formHeader}>
        <CloseFormButton onClose={this.props.onClose} />
      </Box>
    );
  }

  protected handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.props.updateFormField({ title: e.target.value });

  protected handleChangeDescription = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => this.props.updateFormField({ description: e.target.value });

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
      <Alert severity="error">
        <AlertTitle>{formError.errorTitle}</AlertTitle>
      </Alert>
    );
  }

  protected handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);
      await new Promise<void>((resolve) => (reader.onload = () => resolve()));
      this.props.updateFormField({ imageDataUrl: reader.result as string });
    } else {
      this.props.updateFormField({ imageDataUrl: null });
    }
  };

  protected handleDeleteImage = () => {
    this.props.updateFormField({ imageDataUrl: null });
  };
}

export type Props = {
  postId?: number;
  title: string;
  description: string;
  imageDataUrl: string | null;
  position?: Position;
  submittingState: LoadingState;
  fetchingState: LoadingState;
  formError?: FormError;
  isFormEditting: boolean;

  updateFormField: (param: UpdateFormFieldParam) => void;
  submitNewArticle: () => void;
  submitEdittedArticle: () => void;
  fetchArticle: (postId: number) => void;
  initialize: () => void;
  handleClickSelectPosition?: () => void;
  updateIsEditting: (isEditting: boolean) => void;
  onClose?: () => void;
};
