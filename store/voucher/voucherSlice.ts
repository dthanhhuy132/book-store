import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {getAllVoucherAsync} from './voucherAsyncAction';

interface IVoucherSlice {
   voucherList: any;
}
const initialState = {
   voucherList: undefined,
   voucherActiveListState: undefined,
};

const voucherSlice = createSlice({
   name: 'voucherSlice',
   initialState,
   reducers: {
      updateEvent: (state, action) => {
         state.voucherList = action.payload;
      },
   },

   extraReducers: (builder) => {
      builder.addCase(getAllVoucherAsync.fulfilled, (state, action) => {
         const voucherList = action.payload.data;
         const voucherActiveList = voucherList.filter((voucher) => voucher.status == true);

         state.voucherActiveListState = voucherActiveList;
      });
   },
});

export const {updateEvent} = voucherSlice.actions;
export default voucherSlice.reducer;
