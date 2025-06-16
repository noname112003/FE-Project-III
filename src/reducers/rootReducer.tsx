import { combineReducers } from 'redux';
import storesReducer from './storesReducer.tsx';
import storeSetting from "./storeSettingReducer.tsx";

const rootReducer = combineReducers({
    stores: storesReducer,
    storeSetting: storeSetting,
});

export default rootReducer;
