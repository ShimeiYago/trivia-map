import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import styles from './index.module.css';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { SelializedImageFile } from 'types/selialized-image-file';
import { resizeAndConvertToSelializedImageFile } from 'utils/resize-and-convert-to-selialized-image-file.ts';
import { UploadedImage } from 'types/uploaded-image';
import ReactCrop, { PercentCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getImageSize } from 'utils/get-image-size.ts';
import { BoxModal } from 'views/components/organisms/box-modal';
import { sendGa4ExceptionEvent } from 'utils/send-ga4-exception-event';
import { HelperText } from 'views/components/atoms/helper-text';
import CropIcon from '@mui/icons-material/Crop';

export class ImageField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openCropModal: false,
      enableCrop: props.variant === 'icon' ? true : false,
    };
  }

  render() {
    const { helperText, disabled, src, variant } = this.props;

    const labelClassNames = this.getLabelClassNames();
    const imgClassNames = this.getImgClassNames();
    const contentClassNames = this.getContentClassNames();

    return (
      <div>
        <label className={labelClassNames.join(' ')}>
          {!disabled && (
            <input
              type="file"
              accept="image/*"
              onChange={this.handleFileInputChange}
              className={styles['input-image']}
            />
          )}

          {src && <img src={src} className={imgClassNames.join(' ')} />}

          {!disabled && (
            <div className={contentClassNames.join(' ')}>
              <Typography>
                <AddAPhotoIcon fontSize="large" />
              </Typography>
              {variant === 'photo' && <Typography>タップして写真を追加</Typography>}
            </div>
          )}
        </label>

        {helperText && (
          <Typography align={this.props.variant === 'icon' ? 'center' : 'left'}>
            <HelperText error={this.props.error}>{helperText}</HelperText>
          </Typography>
        )}

        {this.renderCropModal()}
      </div>
    );
  }

  protected handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      this.props.onChange(null);
      return;
    }

    const file = files[0];

    if (!this.props.cropable) {
      try {
        const selializedImage = await resizeAndConvertToSelializedImageFile(
          file,
          this.props.maxLength,
        );
        this.props.onChange(selializedImage);
      } catch (e: unknown) {
        this.props.onCatchError();
      }
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    this.setState({
      uploadedImage: {
        objectUrl: objectUrl,
        fileType: file.type,
        fileName: file.name,
      },
      openCropModal: true,
    });

    if (this.props.variant === 'icon') {
      const squareCrop = await this.getScuareCrop(objectUrl);
      this.setState({
        crop: squareCrop,
      });
    }

    // initialize file input field
    e.target.value = '';
  };

  protected renderCropModal() {
    const { openCropModal, uploadedImage, enableCrop } = this.state;
    const { variant } = this.props;

    const aspect = variant === 'icon' ? 1 : undefined;

    return (
      <BoxModal open={openCropModal}>
        <Box sx={{ m: 2, textAlign: 'center' }}>
          <ReactCrop
            crop={this.state.crop}
            aspect={aspect}
            onChange={this.handleChangeCrop}
            keepSelection
            className={styles['crop']}
            disabled={!enableCrop}
          >
            <img src={uploadedImage?.objectUrl} />
          </ReactCrop>
        </Box>
        <Grid container sx={{ p: 2 }}>
          <Grid item xs={6}>
            {variant !== 'icon' && (
              <Typography align="left" component="div">
                <Button
                  variant="outlined"
                  startIcon={<CropIcon />}
                  onClick={this.handleClickEnableCrop}
                  color="info"
                  disabled={enableCrop}
                >
                  画像切り取り
                </Button>
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography align="right" component="div">
              <Button variant="contained" onClick={this.handleFinishCrop}>
                決定
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </BoxModal>
    );
  }

  protected handleChangeCrop = (_: PixelCrop, percentageCrop: PercentCrop) => {
    this.setState({
      crop: percentageCrop,
    });
  };

  protected handleFinishCrop = async () => {
    const { uploadedImage, crop } = this.state;

    // convert file to SelializedImageFile
    try {
      const selializedImageFile = await resizeAndConvertToSelializedImageFile(
        uploadedImage as UploadedImage,
        this.props.maxLength,
        crop,
      );
      this.props.onChange(selializedImageFile);

      this.setState({
        openCropModal: false,
        uploadedImage: undefined,
        crop: undefined,
      });
    } catch (e) {
      const error = e as { message: string };

      sendGa4ExceptionEvent({
        errorCategory: 'front-error',
        errorLabel: 'image-field-error',
        message: error.message,
      });

      this.props.onCatchError();
    }
  };

  protected async getScuareCrop(objectUrl: string): Promise<PercentCrop> {
    const aspect = (await getImageSize(objectUrl)).aspect;
    if (aspect <= 1) {
      return {
        unit: '%',
        x: 50 - (100 * aspect) / 2,
        y: 0,
        width: aspect * 100,
        height: 100,
      };
    } else {
      return {
        unit: '%',
        x: 0,
        y: 50 - 100 / (2 * aspect),
        width: 100,
        height: 100 / aspect,
      };
    }
  }

  protected getLabelClassNames() {
    const { variant, disabled, src } = this.props;

    const classNames = [styles['label']];

    switch (variant) {
      case 'photo':
        classNames.push(styles['variant-photo']);
        break;
      case 'icon':
        classNames.push(styles['variant-icon']);
        break;
    }

    if (!disabled) classNames.push(styles['label-active']);

    if (!src) classNames.push(styles['label-noimage']);

    return classNames;
  }

  protected getImgClassNames() {
    const { variant } = this.props;

    const classNames = [styles['img']];

    switch (variant) {
      case 'photo':
        classNames.push(styles['variant-photo']);
        break;
      case 'icon':
        classNames.push(styles['variant-icon']);
        break;
    }

    return classNames;
  }

  protected getContentClassNames() {
    const { variant } = this.props;

    const classNames = [styles['content']];

    switch (variant) {
      case 'photo':
        classNames.push(styles['content-large']);
        break;
      case 'icon':
        classNames.push(styles['content-small']);
        break;
    }

    return classNames;
  }

  protected handleClickEnableCrop = () => {
    const initialCrop: PercentCrop = {
      unit: '%',
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    };

    this.setState({
      enableCrop: true,
      crop: initialCrop,
    });
  };
}

export type Props = {
  error?: boolean;
  helperText?: React.ReactNode;
  cropable?: boolean;
  disabled?: boolean;
  variant: 'photo' | 'icon';
  src?: string;
  maxLength: number;

  onChange: (src: SelializedImageFile | null) => void;
  onCatchError: () => void;
};

export type State = {
  openCropModal: boolean;
  uploadedImage?: UploadedImage;
  crop?: PercentCrop;
  enableCrop: boolean;
};
