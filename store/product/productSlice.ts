import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {getProductByNameAsync} from './productAsynAction';

interface IProductSlice {
   productList: any;
}
const initialState = {
   productByGroupNameForUser: undefined,
   productListState: undefined,
   isShowLoadingShopPage1stTime: true,
};

const productSlice = createSlice({
   name: 'productSlice',
   initialState,
   reducers: {
      updateProductByGroupNameForUser: (state, action) => {
         state.productByGroupNameForUser = action.payload;
      },

      setIsShowLoadingShopPage: (state) => {
         state.isShowLoadingShopPage1stTime = false;
      },
   },

   extraReducers: (builder) => {
      builder.addCase(getProductByNameAsync.fulfilled, (state, action) => {
         const data = action.payload;
         console.log('data trong product slide', data);
         state.productListState = data.data;
      });
   },
});

export const {updateProductByGroupNameForUser, setIsShowLoadingShopPage} = productSlice.actions;
export default productSlice.reducer;
