import {combineReducers} from 'redux';
import speedReducer from './speedReducer';

const rootReducer = combineReducers({
  speed: speedReducer,
});
export default rootReducer;
