import api from './api';

const cartApi = {
   addToCart(token, cartData) {
      console.log('token và cartData trpmg cart API', token, cartData);
      return api.callWithToken(token).post('/cart/add', cartData);
   },

   removeCartItem(token, cartRemoveData) {
      return api.callWithToken(token).put(`/cart/delete`, cartRemoveData);
   },

   getCartByUserId(token, userId) {
      return api.callWithToken(token).get(`/cart/${userId}`);
   },
};

export default cartApi;
