import { ToggleGoodResponse } from '../../goods-api/toggle-good';
import { CheckGoodStatusResponse } from 'api/goods-api/check-good-status';

export const mockCheckGoodStatusResponse: CheckGoodStatusResponse = {
  haveAddedGood: true,
};

export const mockToggleGoodResponse: ToggleGoodResponse = {
  haveAddedGood: true,
  numberOfGoods: 2,
};
