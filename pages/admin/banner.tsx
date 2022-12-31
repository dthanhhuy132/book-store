import {useState, useRef, useEffect} from 'react';
import Cookies from 'js-cookie';

import {GetServerSideProps} from 'next';

import {AdminLayout, AdminModal} from '../../components/Admin';
import {AdminButton} from '../../components/Admin/common';
import {AiOutlinePlusCircle} from 'react-icons/ai';
import panelApi from '../../service/panelApi';
import {PANEL_FOR_BANNER, PANEL_FOR_HOME} from '../../store/panel/panelSlice';
import sortDataByUpdatedTime from '../../components/Admin/common/sortDataByUpdatedTime';
import {useAppDispatch, useAppSelector} from '../../store';
import {
   createPanelAsyns,
   getAllPanelAsync,
   udpatePanelAsync,
} from '../../store/panel/panelAsyncAction';
import LoadingActionPage from '../../components/common/LoadingPage';
import {toast} from 'react-toastify';
import HomeAdminModalCreateUpdate from '../../components/Admin/Home/HomeAdminModalCreateUpdate';
import HomePanaleItem from '../../components/Admin/Home/HomePanelItem';
import BannerShopItem from '../../components/Admin/Product/BannerShopItem';
import {ShopBannerCreateUpdateModal} from '../../components/Admin/Product';

const accessToken = Cookies.get('accessToken');

export default function ProductBannerPage({homePanelList}) {
   const dispatch = useAppDispatch();
   const [isShowLoading, setIsShowLoading] = useState(false);
   const [isShowModalBannerPanel, setIsShowModalBannerPanel] = useState(false);

   const [renderBannerPanelList, setBannerlList] = useState(
      homePanelList?.filter((item) => item?.description?.indexOf(PANEL_FOR_BANNER) >= 0)
   );

   // get data from redux
   const {panelForBannerState} = useAppSelector((state) => state.panel);
   const [editingHome, setEditingHome] = useState(null);
   // function add new panel
   function handleCreateUpdateHome(bannerPanel) {
      setIsShowLoading(true);
      console.log(bannerPanel);
      const {description, pictures, homPanelId, isChangeImage} = bannerPanel;

      if (homPanelId) {
         // edit panel for home
         const panelId = homPanelId;
         if (isChangeImage === true) {
            // change picture
            const data = new FormData();
            data.append('description', description);
            pictures.forEach((pic) => data.append('pictures', pic));

            // change variable name
            dispatch(udpatePanelAsync({accessToken, panelId, data})).then((res) => {
               if (res.payload.ok) {
                  dispatch(getAllPanelAsync());
                  setIsShowModalBannerPanel(false);
               } else {
                  toast.error(res.payload.message);
               }
               setIsShowLoading(false);
            });
         } else {
            const data = {description};
            dispatch(udpatePanelAsync({accessToken, panelId, data})).then((res) => {
               if (res.payload.ok) {
                  dispatch(getAllPanelAsync());
                  setIsShowModalBannerPanel(false);
               } else {
                  toast.error(res.payload.messsage);
               }
               setIsShowLoading(false);
            });
         }
      } else {
         // create panel for banner
         setIsShowLoading(true);
         const formData = new FormData();
         formData.append('description', description);

         pictures.forEach((pic) => formData.append('pictures', pic));
         dispatch(createPanelAsyns({accessToken, formData})).then((res) => {
            setIsShowLoading(false);
            if (res.payload.ok) {
               dispatch(getAllPanelAsync());
               setIsShowModalBannerPanel(false);
            } else {
               toast.error(res.payload.message);
            }
            setIsShowLoading(false);
         });
      }
   }

   // click to edit banner
   function handleClickEditBannerPanel(bannerPanel) {
      setIsShowModalBannerPanel(true);

      setEditingHome(bannerPanel);
   }

   // update home after create/update new home panel
   useEffect(() => {
      if (panelForBannerState || panelForBannerState?.length > 0) {
         const sortHomePanelState = sortDataByUpdatedTime(panelForBannerState);
         setBannerlList(sortHomePanelState);
      }
   }, [panelForBannerState]);

   // reset editing story
   useEffect(() => {
      if (!isShowModalBannerPanel) {
         setEditingHome(null);
      }
   }, [isShowModalBannerPanel]);

   return (
      <AdminLayout>
         <div className='mb-3 italic'>
            <p>
               - Số lượng hình ảnh Banner hiển thị trên Điện thoại phải bằng với số lượng hình ảnh
               hiển thị trên PC
            </p>

            <p>- Tổng số lượng hình ảnh upload &quot;luôn&quot; là số chẵn</p>
         </div>
         <div className='flex justify-between'>
            <div>
               <AdminButton click={(e) => setIsShowModalBannerPanel(true)}>
                  <AiOutlinePlusCircle /> Create Banner Slider
               </AdminButton>
            </div>
         </div>

         {/* slider list */}
         {renderBannerPanelList && renderBannerPanelList.length > 0 ? (
            <>
               <div className='grid grid-cols-1 gap-5 mt-5'>
                  <p className='font-bold border-b-2'>Slider mobile</p>

                  {renderBannerPanelList.map((item, index) => (
                     // list image of each pannel
                     <div key={index}>
                        <BannerShopItem
                           index={index}
                           homePanel={item}
                           handleClickEditBannerPanel={handleClickEditBannerPanel}
                        />
                     </div>
                  ))}
               </div>
            </>
         ) : (
            <div className='mt-5 border-t-2'>Slider is empty</div>
         )}

         {/* modal create */}
         {isShowModalBannerPanel && (
            <AdminModal
               className='w-[90%]'
               showFooter={false}
               cancel={() => setIsShowModalBannerPanel(false)}
               title='Create new home image'>
               <ShopBannerCreateUpdateModal
                  editingHome={editingHome}
                  cancel={() => setIsShowModalBannerPanel(false)}
                  handleCreateUpdateHome={handleCreateUpdateHome}></ShopBannerCreateUpdateModal>
            </AdminModal>
         )}

         {isShowLoading && <LoadingActionPage />}
      </AdminLayout>
   );
}

export const getServerSideProps: GetServerSideProps<any> = async () => {
   let homeImageList;

   try {
      const response = await panelApi.getAllPanel();
      const homePanelRes = response?.data?.data;
      homeImageList = homePanelRes.filter(
         (item) => item?.status !== 'cancel' && item?.pictures?.length > 0
      );
   } catch (error) {}

   return {
      props: {
         homePanelList: sortDataByUpdatedTime(homeImageList) || [],
      },
   };
};
