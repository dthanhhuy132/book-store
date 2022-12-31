import api from './api';

const eventApi = {
   getAllEvent() {
      return api.call().get('event/all');
   },

   createEvent(token, formData) {
      return api.callWithToken(token).post('/event/create', formData);
   },

   deleteEvent(token, eventId) {
      console.log('eventId la gif', eventId);
      return api.callWithToken(token).delete(`/event/delete/${eventId}`);
   },
   updateEvent(token, eventId, data) {
      return api.callWithToken(token).put(`/event/${eventId}`, data);
   },
};

export default eventApi;
