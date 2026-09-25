import { shallow, ShallowWrapper } from 'enzyme';
import { ImageField, Props, State } from '..';
import * as ResizeAndConvertToSelializedImageFileModule from 'utils/resize-and-convert-to-selialized-image-file.ts';
import * as GetImageSizeModule from 'utils/get-image-size.ts';
import { PercentCrop, PixelCrop } from 'react-image-crop';

let wrapper: ShallowWrapper<Props, State, ImageField>;
let resizeAndConvertToSelializedImageFileSpy: jest.SpyInstance;
let getImageSizeSpy: jest.SpyInstance;

const props: Props = {
  variant: 'photo',
  onChange: jest.fn(),
  maxLength: 100,
  onCatchError: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<ImageField {...props} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with helperText', () => {
    wrapper.setProps({ helperText: 'text' });
    expect(wrapper).toMatchSnapshot();
  });

  it('with error', () => {
    wrapper.setProps({ error: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('with error & helperText', () => {
    wrapper.setProps({ error: true, helperText: 'text' });
    expect(wrapper).toMatchSnapshot();
  });

  it('disabled', () => {
    wrapper.setProps({ disabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('icon', () => {
    wrapper.setProps({ variant: 'icon' });
    expect(wrapper).toMatchSnapshot();
  });

  it('with src', () => {
    wrapper.setProps({ src: 'https://xxx.image.png' });
    expect(wrapper).toMatchSnapshot();
  });

  it('open modal', () => {
    wrapper.setState({ openCropModal: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('with helperText & icon variant', () => {
    wrapper.setProps({ helperText: 'xxx', variant: 'icon' });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleFileInputChange', () => {
  const origCreateObjectURL = URL.createObjectURL;

  beforeEach(() => {
    wrapper = shallow(<ImageField {...props} />);

    resizeAndConvertToSelializedImageFileSpy = jest.spyOn(
      ResizeAndConvertToSelializedImageFileModule,
      'resizeAndConvertToSelializedImageFile',
    );
    getImageSizeSpy = jest.spyOn(GetImageSizeModule, 'getImageSize');
    URL.createObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    URL.createObjectURL = origCreateObjectURL;
  });

  it('call onChange prop with imageData when image is uploaded', async () => {
    resizeAndConvertToSelializedImageFileSpy.mockResolvedValue({
      dataUrl: 'data:image/png;base64,xxx',
      fileName: 'filename',
    });

    const blob = new Blob(['image-data']);
    const file = new File([blob], 'test.jpeg', {
      type: 'image/jpeg',
    });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    const instance = wrapper.instance();
    await instance['handleFileInputChange'](event);

    expect(instance.props.onChange).toBeCalledWith({
      dataUrl: 'data:image/png;base64,xxx',
      fileName: 'filename',
    });
  });

  it('call onCatchError prop when invalid image is uploaded', async () => {
    resizeAndConvertToSelializedImageFileSpy.mockRejectedValue(new Error());

    const blob = new Blob(['image-data']);
    const file = new File([blob], 'test.jpeg', {
      type: 'image/jpeg',
    });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    const instance = wrapper.instance();
    await instance['handleFileInputChange'](event);

    expect(instance.props.onCatchError).toBeCalled();
  });

  it('do not set imageData with no image', async () => {
    const event = {
      target: {
        files: [],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    const instance = wrapper.instance();
    await instance['handleFileInputChange'](event);

    expect(instance.props.onChange).toBeCalledWith(null);
  });

  it('set initial crop for icon variant', async () => {
    getImageSizeSpy.mockResolvedValue({
      width: 100,
      height: 100,
      aspect: 0.5,
    });

    wrapper = shallow(<ImageField {...props} cropable variant="icon" />);

    const blob = new Blob(['image-data']);
    const file = new File([blob], 'test.jpeg', {
      type: 'image/jpeg',
    });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    const instance = wrapper.instance();
    await instance['handleFileInputChange'](event);

    expect(instance.state.crop).toEqual({
      unit: '%',
      x: 25,
      y: 0,
      width: 50,
      height: 100,
    });
  });

  it('set initial crop for icon variant in case width is longer', async () => {
    getImageSizeSpy.mockResolvedValue({
      width: 100,
      height: 100,
      aspect: 2,
    });

    wrapper = shallow(<ImageField {...props} cropable variant="icon" />);

    const blob = new Blob(['image-data']);
    const file = new File([blob], 'test.jpeg', {
      type: 'image/jpeg',
    });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    const instance = wrapper.instance();
    await instance['handleFileInputChange'](event);

    expect(instance.state.crop).toEqual({
      unit: '%',
      x: 0,
      y: 25,
      width: 100,
      height: 50,
    });
  });

  it('do not set initial crop for photo variant', async () => {
    getImageSizeSpy.mockResolvedValue({
      width: 100,
      height: 100,
      aspect: 0.5,
    });

    wrapper = shallow(<ImageField {...props} cropable />);

    const blob = new Blob(['image-data']);
    const file = new File([blob], 'test.jpeg', {
      type: 'image/jpeg',
    });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    const instance = wrapper.instance();
    await instance['handleFileInputChange'](event);

    expect(instance.state.crop).toEqual(undefined);
  });
});

describe('handleChangeCrop', () => {
  beforeEach(() => {
    wrapper = shallow(<ImageField {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set crop', () => {
    const instance = wrapper.instance();

    const crop: PercentCrop = {
      unit: '%',
      x: 25,
      y: 25,
      width: 50,
      height: 50,
    };

    instance['handleChangeCrop']({} as PixelCrop, crop);

    expect(instance.state.crop).toEqual(crop);
  });
});

describe('handleFinishCrop', () => {
  beforeEach(() => {
    wrapper = shallow(<ImageField {...props} />);

    resizeAndConvertToSelializedImageFileSpy = jest.spyOn(
      ResizeAndConvertToSelializedImageFileModule,
      'resizeAndConvertToSelializedImageFile',
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call onChange prop with image data', async () => {
    resizeAndConvertToSelializedImageFileSpy.mockResolvedValue({
      dataUrl: 'data:image/png;base64,xxx',
      fileName: 'filename',
    });

    const instance = wrapper.instance();
    await instance['handleFinishCrop']();

    expect(instance.props.onChange).toBeCalledWith({
      dataUrl: 'data:image/png;base64,xxx',
      fileName: 'filename',
    });
  });

  it('should call onCatchError prop if failed', async () => {
    resizeAndConvertToSelializedImageFileSpy.mockRejectedValue(new Error());

    const instance = wrapper.instance();
    await instance['handleFinishCrop']();

    expect(instance.props.onCatchError).toBeCalled();
  });
});

describe('handleClickEnableCrop', () => {
  beforeEach(() => {
    wrapper = shallow(<ImageField {...props} />);
  });

  it('should set enableCrop true', () => {
    const instance = wrapper.instance();
    instance['handleClickEnableCrop']();

    expect(instance.state.enableCrop).toBeTruthy();
  });
});
