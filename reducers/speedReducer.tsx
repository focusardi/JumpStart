import {SpeedActionTypes} from './speedActionType';
import {updateRecord} from './speedUtils';

interface SpeedReordMap {
  [name: string]: any;
}

const INITIAL_STATE = {
  nowPosition: null,
  nowSpeed: 0,
  nowRecord: [],
  nowlocation: null,
  nowTime: null,
  sessions: [],
};

const speedReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SpeedActionTypes.SET_CURRENT_SPEED:
      //console.log(state);
      //console.log(action.payload.position);
      state.nowSpeed = action.payload.speed;
      state.nowPosition = action.payload.position;
      return {
        ...state,
        nowRecord: updateRecord(
          state.nowRecord,
          action.payload.speed,
          action.payload.latitude,
          state.nowTime,
        ),
      };
      //return state;
    case SpeedActionTypes.TEST:
      //console.log(action.payload);
      return state;
    default:
      //console.log(state);
      //console.log(action.payload);
      //console.log(action.payload.latitude);
      //console.log(action.payload.speed);
      return state;
  }
};
export default speedReducer;
