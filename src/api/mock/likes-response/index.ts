import { ToggleLikeResponse } from './../../likes-api/toggle-like';
import { CheckLikeStatusResponse } from 'api/likes-api/check-like-status';

export const mockCheckLikeStatusResponse: CheckLikeStatusResponse = {
  haveLiked: true,
};

export const mockToggleLikeResponse: ToggleLikeResponse = {
  haveLiked: true,
  numberOfLikes: 2,
};
