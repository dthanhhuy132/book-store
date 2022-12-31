import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {getAllPaymentAsync} from './paymentAsynAction';

interface IPaymentSlice {
   eventState: any;
}
const initialState = {
   paymentForUserState: undefined,
   allPaymentAmdminState: undefined,
};

const paymentSlice = createSlice({
   name: 'paymentSlice',
   initialState,
   reducers: {
      updatePaymentForUser: (state, action) => {
         state.paymentForUserState = action.payload;
      },

      setAllPaymentForAdminState: (state, action) => {
         state.allPaymentAmdminState = action.payload;
      },
   },

   extraReducers: (builder) => {
      builder.addCase(getAllPaymentAsync.fulfilled, (state, action) => {
         console.log('chay vao thay doi state');
         const allPayment = action.payload.data;
         state.allPaymentAmdminState = allPayment;
      });
   },
});

export const {updatePaymentForUser, setAllPaymentForAdminState} = paymentSlice.actions;
export default paymentSlice.reducer;
