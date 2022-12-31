import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {getCartByUserId} from './cartAsynAction';

interface IAuthSlice {
   cartState: any;
}
const initialState = {
   cartUserState: undefined,
};

const cartSlice = createSlice({
   name: 'cartSlice',
   initialState,
   reducers: {
      updateCartUserState: (state, action: PayloadAction<any>) => {
         state.cartUserState = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder.addCase(getCartByUserId.fulfilled, (state, action) => {
         const cartItemArr = action.payload.data;
         state.cartUserState =
            cartItemArr?.length >= 2
               ? cartItemArr.sort((productCart1, productCart2) => {
                    if (productCart1?.product?.name < productCart2?.product?.name) return -1;
                    if (productCart1?.product?.name > productCart2?.product?.name) return 1;
                    return 0;
                 })
               : cartItemArr;
      });
   },
});

export const {updateCartUserState} = cartSlice.actions;
export default cartSlice.reducer;
