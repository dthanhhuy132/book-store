import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {createWrapper, HYDRATE} from 'next-redux-wrapper';
import {getAllCategoryAsync} from './categoryAsynAcion';

interface IAuthSlice {
   categoryProductState: any;
}
const initialState = {
   categoryProductState: undefined,
   allCategoryStateAdmin: undefined,
   allPromoState: undefined,

   allPromoStateAdmin: undefined,
};

const categoryPromoSlice = createSlice({
   name: 'categoryPromoSlice',
   initialState,
   reducers: {
      updateCategoryProduct: (state, action) => {
         state.categoryProductState = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder.addCase(getAllCategoryAsync.fulfilled, (state, action) => {
         const data = action.payload.data;
         const allCategoryStateAdmin = data?.filter(
            (cate) =>
               cate.status == true &&
               (cate?.description?.indexOf('-category-for-promo') < 0 || !cate?.description)
         );
         const allCategoryPromoStateAmin = data?.filter(
            (cate) => cate.status == true && cate?.description?.indexOf('-category-for-promo') >= 0
         );
         state.allCategoryStateAdmin = allCategoryStateAdmin;
         state.allPromoStateAdmin = allCategoryPromoStateAmin;
      });
   },
});

export const {updateCategoryProduct} = categoryPromoSlice.actions;
export default categoryPromoSlice.reducer;
