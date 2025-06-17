export const STORE_SETTING_ACTIONS = {
    SET_STORE: 'SET_STORE',
    UPDATE_STORE: 'UPDATE_STORE',
};

export const setStore = (store: any) => ({
    type: STORE_SETTING_ACTIONS.SET_STORE,
    payload: store,
});

export const updateStore = (store: any) => ({
    type: STORE_SETTING_ACTIONS.UPDATE_STORE,
    payload: store,
});

interface store {
    id: number | null;
    name: string;
    address: string;
    phone: string;
    status: string;
    createdAt: number | null;
    modifiedOn: number | null;
}

export interface StoreSettingState {
    store: store | null;
}

const initialState: StoreSettingState = {
    store: null,  // Khởi tạo store là null
};

const storeSettingReducer = (state = initialState, action: any): StoreSettingState => {
    switch (action.type) {
        case STORE_SETTING_ACTIONS.SET_STORE:
            return {
                ...state,
                store: action.payload,  // Lưu thông tin store vào state
            };
        case STORE_SETTING_ACTIONS.UPDATE_STORE:
            return {
                ...state,
                store: { ...state.store, ...action.payload },  // Cập nhật thông tin store
            };
        default:
            return state;
    }
};

export default storeSettingReducer;