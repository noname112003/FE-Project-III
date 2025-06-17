import { combineReducers } from 'redux';
import storesReducer, {StoreState} from './storesReducer.tsx';
import storeSetting, {StoreSettingState} from "./storeSettingReducer.tsx";

const rootReducer = combineReducers({
    stores: storesReducer,
    storeSetting: storeSetting,
});
export type RootState = {
    stores: StoreState; // Áp dụng kiểu StoreState cho stores
    storeSetting: StoreSettingState; // Áp dụng kiểu StoreSettingState cho storeSetting
};

export default rootReducer;
