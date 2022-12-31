import {PANEL_FOR_BANNER, PANEL_FOR_HOME, PANEL_FOR_STORY} from '../../../store/panel/panelSlice';

export default function slicePanelLinkName(str) {
   return str
      ? str.replace(PANEL_FOR_BANNER, '').replace(PANEL_FOR_STORY, '').replace(PANEL_FOR_HOME, '')
      : '';
}
