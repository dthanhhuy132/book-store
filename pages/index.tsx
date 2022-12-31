import {useEffect, useState} from 'react';
import sortDataByUpdatedTime from '../components/Admin/common/sortDataByUpdatedTime';
import {Home} from '../components/Home';
import panelApi from '../service/panelApi';
import {useAppDispatch} from '../store';
import {PANEL_FOR_HOME, updateHomePanelUser} from '../store/panel/panelSlice';

export default function HomePage({homePanelList}) {
   const [homeImagePanel, setHomeImagePanel] = useState(sortDataByUpdatedTime(homePanelList));

   return <Home homeImage={homeImagePanel[0]}></Home>;
}

export const getServerSideProps = async () => {
   let homeImageList;

   try {
      const response = await panelApi.getAllPanel();
      const homePanelRes = response?.data?.data;
      homeImageList = homePanelRes
         ?.filter((item) => item?.status !== 'cancel' && item?.pictures?.length > 0)
         ?.filter((item) => item?.description?.indexOf(PANEL_FOR_HOME) >= 0);
   } catch (error) {}

   return {
      props: {
         homePanelList: homeImageList || [],
      },
   };
};
