import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

import authReducer from './auth/authSlice';
import cartReducer from './cart/cartSlice';
import categoryPromoSlice from './categoryPromo/categoryPromoSlice';
import eventReducer from './event/eventSlice';
import voucherReducer from './voucher/voucherSlice';
import productReducer from './product/productSlice';
import panelReducer from './panel/panelSlice';
import paymentReducer from './payment/paymentSlice';

const store = configureStore({
   reducer: {
      auth: authReducer,
      cart: cartReducer,
      category: categoryPromoSlice,
      event: eventReducer,
      voucher: voucherReducer,
      product: productReducer,
      panel: panelReducer,
      payment: paymentReducer,
   },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}

export type AppDispatch = typeof store.dispatch;
export type AppSelector = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
