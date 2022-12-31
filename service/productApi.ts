import api from './api';

const productApi = {
   getAllProduct: ({page = 1, perPage = 20} = {}) => {
      const url = `/product/all?page=${page}&perPage=${perPage}`;
      return api.call().get(url);
   },

   getAllProductByName: () => {
      return api.call().get('/product/allByName');
   },

   searchProduct: (searchStr) => {
      return api.call().get(`product/search?keyName=${searchStr}`);
   },

   createNewProduct: (token, formData) => {
      return api.callWithToken(token).post('/product/create', formData);
   },

   updateProduct: (token, id, formData) => {
      return api.callWithToken(token).put(`/product/${id}`, formData);
   },

   deleteProduct: (token, productId) => {
      return api.callWithToken(token).delete(`/product/${productId}`);
   },

   getProductById: (productId) => {
      return api.call().get(`/product/${productId}`);
   },
};

export default productApi;
