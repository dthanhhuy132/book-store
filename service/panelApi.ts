import api from './api';

const panelApi = {
   getAllPanel() {
      return api.call().get('panel/all');
   },

   createPanel(token, formData) {
      return api.callWithToken(token).post('/panel/create', formData);
   },
   updatePanel(token, panelId, data) {
      return api.callWithToken(token).put(`/panel/${panelId}`, data);
   },
   deletePanel(token, panelId) {
      return api.callWithToken(token).delete(`/panel/delete/${panelId}`);
   },
};

export default panelApi;
