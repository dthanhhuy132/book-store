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

// create new product

export const createNewProduct: any = createAsyncThunk(
   'prodcut/createNewProduct',
   async ({accessToken, formData}: any) => {
      try {
         const res = await productApi.createNewProduct(accessToken, formData);
         const data = res?.data?.data;

         console.log('data trong tạo product moi la gi', data);

         return {
            ok: true,
            data: data,
         };
      } catch (error) {
         return {
            ok: false,
         };
      }
   }
);

export const updateProduct: any = createAsyncThunk(
   'prodcut/updateProduct',
   async ({accessToken, productId, formData}: any) => {
      try {
         const res = await productApi.updateProduct(accessToken, productId, formData);
         const data = res?.data?.data;

         console.log('data trong tạo product moi la gi', data);

         return {
            ok: true,
            data: data,
         };
      } catch (error) {
         return {
            ok: false,
         };
      }
   }
);

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
