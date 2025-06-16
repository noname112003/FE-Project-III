interface StoreState {
    stores: any[];  // Mảng chứa thông tin cửa hàng
}

const initialState: StoreState = {
    stores: [],
};

const STORE_ACTIONS = {
    SET_STORES: 'SET_STORES',
    UPDATE_STORES: 'UPDATE_STORES',
};

export const setStores = (stores: any) => ({
    type: STORE_ACTIONS.SET_STORES,
    payload: stores,
});

// export const updateStore = (store) => ({
//     type: STORE_ACTIONS.UPDATE_STORE,
//     payload: store,
// });

const storesReducer = (state = initialState, action) => {
    switch (action.type) {
        case STORE_ACTIONS.SET_STORES:
            return {
                ...state,
                stores: action.payload,
            };
        case STORE_ACTIONS.UPDATE_STORES:
            return {
                ...state,
                stores: action.payload,
            };
        default:
            return state;
    }
};

export default storesReducer;