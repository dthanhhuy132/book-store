import api from './api';

const paymentApi = {
   createPayment(token, paymentData) {
      return api.callWithToken(token).post('/payment/create', paymentData);
   },

   getAllPayment(token) {
      return api.callWithToken(token).get('/payment/getAll');
   },

   updatePaymentById(token, paymentId, paymentUpdateData) {
      return api.callWithToken(token).put(`/payment/${paymentId}`, paymentUpdateData);
   },

   getPaymentByUser(token, userId) {
      return api.callWithToken(token).get(`payment/user/${userId}`);
   },

   deletePayment(token, paymentId) {
      return api.callWithToken(token).delete(`payment/delete/${paymentId}`);
   },
};

export default paymentApi;
