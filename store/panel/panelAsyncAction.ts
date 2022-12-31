import {createAsyncThunk} from '@reduxjs/toolkit';
import panelApi from '../../service/panelApi';

export const getAllPanelAsync: any = createAsyncThunk('event/getAllPanelAsync', async () => {
   try {
      const res = await panelApi.getAllPanel();

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

export const createPanelAsyns: any = createAsyncThunk(
   'event/createPanelAsyns',
   async ({accessToken, formData}: any) => {
      try {
         const res = await panelApi.createPanel(accessToken, formData);

         return {
            ok: true,
            // data: res.data.res,
         };
      } catch (error) {
         return {
            ok: false,
            message: error.response.data.message,
         };
      }
   }
);

export const udpatePanelAsync: any = createAsyncThunk(
   'event/udpatePanelAsync',
   async ({accessToken, panelId, data}: any) => {
      try {
         const res = await panelApi.updatePanel(accessToken, panelId, data);

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

export const deletePanelAsync: any = createAsyncThunk(
   'event/deletePanelAsync',
   async ({accessToken, panelId}: any) => {
      try {
         const res = await panelApi.deletePanel(accessToken, panelId);

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
