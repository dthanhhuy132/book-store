import {createAsyncThunk} from '@reduxjs/toolkit';
import eventApi from '../../service/eventApi';

export const getAllEventAsync: any = createAsyncThunk('event/getAllEventAsync', async () => {
   try {
      const res = await eventApi.getAllEvent();

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

export const createEventAsyns: any = createAsyncThunk(
   'event/createNewEventAsync',
   async ({accessToken, formData}: any) => {
      try {
         const res = await eventApi.createEvent(accessToken, formData);
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

export const udpateEvetAsync: any = createAsyncThunk(
   'event/createEventAsync',
   async ({accessToken, eventId, data}: any) => {
      try {
         const res = await eventApi.updateEvent(accessToken, eventId, data);

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

export const deleteEventAsync: any = createAsyncThunk(
   'event/createEventAsync',
   async ({accessToken, eventId}: any) => {
      try {
         const res = await eventApi.deleteEvent(accessToken, eventId);

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
