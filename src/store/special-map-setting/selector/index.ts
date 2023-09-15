/* istanbul ignore file */

import { RootState } from 'store';

type SpecialMapSettingRootState = Pick<RootState, 'specialMapSetting'>;

export const selectSpecialMapSetting = (state: SpecialMapSettingRootState) =>
  state.specialMapSetting;

export const selectSpecialMapId = (state: SpecialMapSettingRootState) =>
  state.specialMapSetting.specialMapId;

export const selectSpecialMapTitle = (state: SpecialMapSettingRootState) =>
  state.specialMapSetting.title;

export const selectSpecialMapDescription = (state: SpecialMapSettingRootState) =>
  state.specialMapSetting.description;

export const selectSpecialMapIsPublic = (state: SpecialMapSettingRootState) =>
  state.specialMapSetting.isPublic;

export const selectSpecialMapSelectablePark = (state: SpecialMapSettingRootState) =>
  state.specialMapSetting.selectablePark;

export const selectSpecialMapThumbnail = (state: SpecialMapSettingRootState) =>
  state.specialMapSetting.thumbnail;

export const selectSpecialMapArea = (state: SpecialMapSettingRootState) =>
  state.specialMapSetting.area;

export const selectSpecialMapLoading = (state: SpecialMapSettingRootState) =>
  state.specialMapSetting.loading;

export const selectSpecialMapFormError = (state: SpecialMapSettingRootState) =>
  state.specialMapSetting.formError;
