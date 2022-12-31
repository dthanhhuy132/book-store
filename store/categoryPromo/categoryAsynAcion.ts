import {createAsyncThunk} from '@reduxjs/toolkit';
import categoryApi from '../../service/categoryApi';
import productApi from '../../service/productApi';

export const getAllCategoryAsync: any = createAsyncThunk('category/getAllCategory', async () => {
   try {
      const res = await categoryApi.getAllCategory();

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

export const createNewCategoryAsync: any = createAsyncThunk(
   'category/create',
   async ({accessToken, data}: any) => {
      try {
         const res = await categoryApi.createCategory(accessToken, data);

         return {
            ok: true,
         };
      } catch (error) {
         return {
            ok: false,
            messsage: error?.response?.data?.message,
         };
      }
   }
);

export const updateCategoryAnsync: any = createAsyncThunk(
   'category/updateCategoryAnsync',
   async ({accessToken, categoryId, data}: any) => {
      try {
         const res = await categoryApi.updateCategory(accessToken, categoryId, data);

         return {
            ok: true,
         };
      } catch (error) {
         return {
            ok: false,
            message: error.response.data.message,
         };
      }
   }
);

export const deleteCategoryAsync: any = createAsyncThunk(
   'category/deleteCategory',
   async ({accessToken, categoryId}: any) => {
      try {
         const res = await categoryApi.deleteCategory(accessToken, categoryId);

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
