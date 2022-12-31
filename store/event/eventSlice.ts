import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {createWrapper, HYDRATE} from 'next-redux-wrapper';
import {getAllEventAsync} from './eventAsynAction';

export const EVENT_FOR_EVENT = 'EVENT_FOR_EVENT';
export const EVENT_FOR_PROMO = 'EVENT_FOR_PROMO';
interface IEventSlice {
   eventState: any;
   eventStateForEvent: any;
   eventStateForPromo: any;
}
const initialState = {
   eventState: undefined,
   eventStateForEvent: undefined,
   eventStateForPromo: undefined,
};

const eventSlice = createSlice({
   name: 'eventSlice',
   initialState,
   reducers: {
      updateEvent: (state, action) => {
         state.eventState = action.payload;
         state.eventStateForEvent = action.payload.filter(
            (event) => event.typeEvent.toUpperCase() === EVENT_FOR_EVENT
         );
      },
   },

   extraReducers: (builder) => {
      builder.addCase(getAllEventAsync.fulfilled, (state, action) => {
         const eventList = action.payload.data;
         const eventActive = eventList?.filter((event) => event.status == true) || [];
         const eventForEvent = eventActive.filter(
            (event) => event.typeEvent.toUpperCase() === EVENT_FOR_EVENT
         );

         state.eventState = eventActive;
         state.eventStateForEvent = eventForEvent;
      });
   },
});

export const {updateEvent} = eventSlice.actions;
export default eventSlice.reducer;
