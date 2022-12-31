import api from './api';

const categoryApi = {
   getAllCategory() {
      const url = '/category/all';
      return api.call().get(url);
   },

   getCategoryById(categoryId: string) {
      return api.call().get(`/category/${categoryId}`);
   },

   createCategory(token, formData) {
      return api.callWithToken(token).post('/category/create', formData);
   },

   updateCategory(token, categoryId, data) {
      return api.callWithToken(token).put(`/category/${categoryId}`, data);
   },

   deleteCategory(token, categoryId) {
      return api.callWithToken(token).delete(`/category/delete/${categoryId}`);
   },
};

export default categoryApi;
