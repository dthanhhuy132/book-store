import {createAsyncThunk} from '@reduxjs/toolkit';
import productApi from '../../service/productApi';
import voucherApi from '../../service/voucherApi';

export const getAllVoucherAsync: any = createAsyncThunk('voucher/getAllVoucherAsync', async () => {
   try {
      const res = await voucherApi.getAllVoucher();
      return {
         ok: true,
         data: res.data.data,
      };
   } catch (error) {
      return {
         ok: false,
      };
   }
});

export const createVoucherAsync: any = createAsyncThunk(
   'voucher/createNewVoucherAsync',
   async ({accessToken, voucher}: any) => {
      try {
         const res = await voucherApi.createVoucher(accessToken, voucher);

         return {
            ok: true,
            // data: res.data.res,
         };
      } catch (error) {
         return {
            ok: false,
            messsage: error.response.data.message,
         };
      }
   }
);

export const deleteVoucherAsync: any = createAsyncThunk(
   'voucher/deleterVoucherAsync',
   async ({accessToken, voucherId}: any) => {
      try {
         const res = await voucherApi.deleteVoucher(accessToken, voucherId);

         return {
            ok: true,
         };
      } catch (error) {
         return {
            ok: false,
            messsage: error.response.data.message,
         };
      }
   }
);

export const updateVoucherAsync: any = createAsyncThunk(
   'voucher/updateVoucherAsync',
   async ({accessToken, voucherId, voucher}: any) => {
      try {
         const res = await voucherApi.updateVoucher(accessToken, voucherId, voucher);

         return {
            ok: true,
         };
      } catch (error) {
         return {
            ok: false,
            messsage: error.response.data.message,
         };
      }
   }
);

export const getVoucherByCode: any = createAsyncThunk(
   'voucher/getVoucherByCODE',
   async ({voucherCode}: any) => {
      try {
         const res = await voucherApi.getVoucherByCode(voucherCode);
         return {
            ok: true,
            voucher: res?.data?.data,
         };
      } catch (error) {
         return {
            ok: false,
            messsage: error.response.data.message,
         };
      }
   }
);
