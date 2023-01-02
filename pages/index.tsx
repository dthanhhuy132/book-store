import {useEffect, useState} from 'react';
import sortDataByUpdatedTime from '../components/Admin/common/sortDataByUpdatedTime';
import {Home} from '../components/Home';
import categoryApi from '../service/categoryApi';
import panelApi from '../service/panelApi';
import {useAppDispatch} from '../store';
import {PANEL_FOR_HOME, updateHomePanelUser} from '../store/panel/panelSlice';

export default function HomePage({homePanelList, categoryList}) {
   const [homeImagePanel, setHomeImagePanel] = useState(sortDataByUpdatedTime(homePanelList));

   return <Home homeImage={homeImagePanel[0]} categoryList={categoryList}></Home>;
}

export const getServerSideProps = async () => {
   let homeImageList, categoryList;

   try {
      const response = await panelApi.getAllPanel();
      const categoryRes = await categoryApi.getAllCategory();

      const homePanelData = response?.data?.data;
      const categoryData = categoryRes?.data?.data;

      homeImageList = homePanelData
         ?.filter((item) => item?.status !== 'cancel' && item?.pictures?.length > 0)
         ?.filter((item) => item?.description?.indexOf(PANEL_FOR_HOME) >= 0);

      categoryList = categoryData.filter(
         (cate) =>
            cate.status == true &&
            (cate?.description?.indexOf('-category-for-promo') < 0 || !cate?.description)
      );
   } catch (error) {}

   return {
      props: {
         homePanelList: homeImageList || [],
         categoryList: categoryList || [],
      },
   };
};
