import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';
import { FormError } from 'store/article-form/model';
import { LoadingButton } from '@mui/lab';
import { formContainer } from './styles';
import { TriviaMap } from '../../trivia-map';
import { UpdateFormFieldParam } from 'store/article-form/actions';
import { ImageField } from 'views/components/moleculars/image-field';
import { DeletableImage } from 'views/components/moleculars/deletable-image';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import { User } from 'types/user';
import {
  CATEGORIES,
  INPUT_FIELD_MAX_LENGTH,
  MINI_MAP_HEIGHT,
  UPLOAD_IMAGE_MAX_LENGTH,
  ZOOMS,
} from 'constant';
import { SelializedImageFile } from 'types/selialized-image-file';
import { Park } from 'types/park';
import { getImageSrc } from 'utils/get-image-src.ts';
import { MapField } from 'views/components/moleculars/map-field';

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
      isDraft,
      lastSavedIsDraft,
      submittingState,
      fetchingState,
      formError,
      image,
      areaNames,
      handleClickSelectPosition,
    } = this.props;

    const newMode = !postId;

    const disabled = submittingState === 'loading' || fetchingState === 'loading';

    const miniMapFieldStatus = !!formError?.fieldErrors?.marker
      ? 'error'
      : position
      ? 'valid'
      : 'normal';

    const imageSrc = getImageSrc(image);

    const showIsDraftCheckbox = newMode || lastSavedIsDraft;

    return (
      <Container maxWidth="sm" sx={formContainer}>
        <Stack spacing={3}>
          <Typography component="h2" align="center" variant="h4" ref={this.headerRef}>
            {newMode ? 'トリビアを追加' : 'トリビアを編集'}
          </Typography>

          {fetchingState === 'loading' && (
            <Box sx={{ display: 'flex', justifydescription: 'center' }}>
              <CircularProgress />
            </Box>
          )}

          {this.renderHeaderMessage()}

          <TextField
            label="タイトル"
            variant="standard"
            value={title}
            onChange={this.handleChangeTitle}
            disabled={disabled}
            error={!!formError?.fieldErrors?.title}
            helperText={formError?.fieldErrors?.title}
            required
            inputProps={{ maxLength: INPUT_FIELD_MAX_LENGTH.articleTitle }}
          />

          <MapField
            status={miniMapFieldStatus}
            onClick={handleClickSelectPosition}
            disabled={disabled}
            helperText={formError?.fieldErrors?.marker}
            isSelected={!!this.props.position}
            areaNames={areaNames}
          >
            <TriviaMap
              height={MINI_MAP_HEIGHT}
              initZoom={ZOOMS.miniMap}
              initCenter={position}
              disabled
              doNotShowPostMarkers
              shouldCurrentPositionAsyncWithForm
              park={position?.park ?? this.props.park}
            />
          </MapField>

          {this.renderCategorySelectField(disabled)}

          {imageSrc ? (
            <DeletableImage
              src={imageSrc}
              width="full"
              borderRadius
              onDelete={this.handleDeleteImage}
              errors={formError?.fieldErrors?.image}
            />
          ) : (
            <ImageField
              src={imageSrc}
              onChange={this.handleImageChange}
              variant="photo"
              disabled={disabled}
              error={!!formError?.fieldErrors?.image}
              helperText={formError?.fieldErrors?.image}
              maxLength={UPLOAD_IMAGE_MAX_LENGTH.article}
              onCatchError={this.handleError}
              cropable
            />
          )}

          <TextField
            label="説明文"
            multiline
            minRows={6}
            value={description}
            onChange={this.handleChangeDescription}
            disabled={disabled}
            error={!!formError?.fieldErrors?.description}
            helperText={formError?.fieldErrors?.description}
            required
          />

          {showIsDraftCheckbox && (
            <FormControlLabel
              control={
                <Checkbox
                  onChange={this.handleChangeIsDraft}
                  checked={isDraft}
                  disabled={disabled}
                />
              }
              label="下書きとして保存（非公開）"
            />
          )}

          <LoadingButton
            loading={submittingState === 'loading'}
            variant="contained"
            disabled={disabled}
            onClick={this.handleSubmitButton}
          >
            {isDraft ? '下書き保存' : '保存して公開'}
          </LoadingButton>
        </Stack>
      </Container>
    );
  }

  protected renderCategorySelectField = (disabled: boolean) => {
    const menuItems = CATEGORIES.map((category) => (
      <MenuItem key={`category-${category.categoryId}`} value={category.categoryId.toString()}>
        {category.categoryName}
      </MenuItem>
    ));

    const categoryValue = this.props.category === undefined ? '' : this.props.category.toString();

    return (
      <FormControl fullWidth>
        <InputLabel>カテゴリー</InputLabel>
        <Select
          value={categoryValue}
          label="カテゴリー"
          onChange={this.handleChangeCategory}
          disabled={disabled}
        >
          {menuItems}
        </Select>
      </FormControl>
    );
  };

  protected handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.props.updateFormField({ title: e.target.value });

  protected handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.props.updateFormField({ description: e.target.value });

  protected handleChangeIsDraft = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.props.updateFormField({ isDraft: e.target.checked });

  protected handleSubmitButton = () => {
    if (!this.props.userInfo) {
      return this.openAuthModal();
    }

    this.props.submitArticle();
  };

  protected openAuthModal = () => {
    this.props.toggleAuthFormModal(true);
  };

  protected renderHeaderMessage() {
    const { formError } = this.props;

    if (formError?.errorTitle) {
      return <HeaderErrorMessages errorTitle={formError.errorTitle} />;
    }

    return null;
  }

  // protected renderLoginWarningMessage() {
  //   const { userInfo } = this.props;

  //   if (!userInfo) {
  //     return (
  //       <Alert severity='warning'>
  //         新しいトリビアを投稿するには
  //         <Button sx={{ p: 0 }} onClick={this.openAuthModal}>
  //           ログイン
  //         </Button>
  //         が必要です。
  //       </Alert>
  //     );
  //   }

  //   return null;
  // }

  protected handleImageChange = (src: SelializedImageFile | null) => {
    this.props.updateFormField({ image: src });
  };

  protected handleDeleteImage = () => {
    this.props.updateFormField({ image: null });
  };

  protected handleChangeCategory = (event: SelectChangeEvent) => {
    this.props.updateFormField({ category: Number(event.target.value) });
  };

  protected handleError = () => {
    this.props.throwError(500);
  };
}

export type Props = {
  postId?: number;
  title: string;
  description: string;
  image: string | SelializedImageFile | null;
  category?: number;
  position?: Position;
  areaNames?: string[];
  isDraft: boolean;
  lastSavedIsDraft: boolean;
  submittingState: LoadingState;
  fetchingState: LoadingState;
  formError?: FormError;
  isFormEditting: boolean;
  userInfo?: User;
  park: Park;

  updateFormField: (param: UpdateFormFieldParam) => void;
  submitArticle: () => void;
  fetchArticle: (postId: number) => void;
  initialize: () => void;
  handleClickSelectPosition?: () => void;
  updateIsEditting: (isEditting: boolean) => void;
  toggleAuthFormModal: (open: boolean) => void;
  throwError: (errorStatus: number) => void;
};
