import {createAsyncThunk} from '@reduxjs/toolkit';
import filterProductActive from '../../helper/filterProductActive';
import productApi from '../../service/productApi';

export const getProductByNameAsync: any = createAsyncThunk('prodcut/getProductByName', async () => {
   try {
      const res = await productApi.getAllProductByName();
      const data = res?.data?.data;
      const productListByName = filterProductActive(data);

      return {
         ok: true,
         data: productListByName,
      };
   } catch (error) {
      return {
         ok: false,
      };
   }
});

export const saerchProductByName: any = createAsyncThunk(
   'prodcut/searchProductByName',
   async () => {
      try {
         const res = await productApi.getAllProductByName();

         return {
            ok: true,
            // data: res.data.res,
         };
      } catch (error) {
         return {
            ok: false,
         };
      }
   }
);
