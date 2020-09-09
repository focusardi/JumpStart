import {SpeedActionTypes} from './speedActionType';

export const updateSpeed = item => ({
  type: SpeedActionTypes.SET_CURRENT_SPEED,
  payload: item,
});

export const test2 = item => ({
  type: SpeedActionTypes.TEST,
  payload: item,
});
