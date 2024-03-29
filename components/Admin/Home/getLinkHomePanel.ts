import {PANEL_FOR_HOME} from '../../../store/panel/panelSlice';

export default function getLinkHomePanel(homePanelDesc) {
   if (!homePanelDesc || homePanelDesc == '') {
      return [];
   }
   let strArr = homePanelDesc
      .slice(homePanelDesc?.indexOf('[') + 1, homePanelDesc.indexOf(']'))
      .split(',');
   // .map((str) => str.slice(str.indexOf('"') + 1, str.indexOf('"')));
   return strArr?.map((item) => (item != 'undefined' ? item : ''));
}

export function getLinkBannerPanel(linkBanner) {
   let spitSign = linkBanner?.indexOf('\r\n') > 0 ? '\r\n' : '\n';
   let strArr = linkBanner
      ?.slice(linkBanner.indexOf('[') + 1, linkBanner.indexOf(']'))
      ?.split(spitSign);

   return strArr?.map((item) => (item != 'undefined' ? item : ''));
}
