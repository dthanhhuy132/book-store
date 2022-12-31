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

const accessToken = Cookies.get('accessToken');

export default function AdminHomePage({homePanelList}) {
   const dispatch = useAppDispatch();
   const [isShowLoading, setIsShowLoading] = useState(false);
   const [isShowModalHomePanel, setIsShowModalHomePanel] = useState(false);

   const [renderHomePanelList, setRenderHomePanelList] = useState(
      homePanelList?.filter((item) => item?.description?.indexOf(PANEL_FOR_HOME) >= 0)
   );

   // get data from redux
   const {panelForHomeState} = useAppSelector((state) => state.panel);
   const [editingHome, setEditingHome] = useState(null);
   // function add new panel
   function handleCreateUpdateHome(homePanel) {
      setIsShowLoading(true);

      const {description, pictures, homPanelId, isChangeImage} = homePanel;

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
                  setIsShowModalHomePanel(false);
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
                  setIsShowModalHomePanel(false);
               } else {
                  toast.error(res.payload.messsage);
               }
               setIsShowLoading(false);
            });
         }
      } else {
         // create panel for home
         setIsShowLoading(true);
         const formData = new FormData();
         formData.append('description', description);
         pictures.forEach((pic) => formData.append('pictures', pic));
         dispatch(createPanelAsyns({accessToken, formData})).then((res) => {
            setIsShowLoading(false);
            if (res.payload.ok) {
               dispatch(getAllPanelAsync());
            } else {
               toast.error(res.payload.message);
            }
            setIsShowLoading(false);
         });
      }
   }

   function handleClickEditHomePanel(homePanel) {
      setIsShowModalHomePanel(true);
      setEditingHome(homePanel);
   }

   // update home after create/update new home panel
   useEffect(() => {
      if (panelForHomeState || panelForHomeState?.length > 0) {
         const sortHomePanelState = sortDataByUpdatedTime(panelForHomeState);
         setRenderHomePanelList(sortHomePanelState);
      }
   }, [panelForHomeState]);

   // reset editing story
   useEffect(() => {
      if (!isShowModalHomePanel) {
         setEditingHome(null);
      }
   }, [isShowModalHomePanel]);

   return (
      <AdminLayout>
         <div className='mb-2'>Upload images for home page</div>
         <span className='mb-2 italic'>
            Hình nằm ngang, kích kích các hình nên giống nhau, dung lượng &lt; 300kb, &#40;Bộ hình
            ảnh đầu tiên được sử dụng để hiện thị trên trang home&#41;
         </span>
         <div className='flex justify-between'>
            <div>
               <AdminButton click={(e) => setIsShowModalHomePanel(true)}>
                  <AiOutlinePlusCircle /> Upload image to create panel
               </AdminButton>
            </div>
         </div>

         {/* pannel list */}
         <div className='grid grid-cols-1 gap-5 mt-5'>
            <p className='font-bold border-b-2'>Pannel list</p>

            {renderHomePanelList.map((item, index) => (
               // list image of each pannel
               <div key={index}>
                  <HomePanaleItem
                     index={index}
                     homePanel={item}
                     handleClickEditHomePanel={handleClickEditHomePanel}
                  />
               </div>
            ))}
         </div>
         {/* modal create */}
         {isShowModalHomePanel && (
            <AdminModal
               className='w-[80%]'
               showFooter={false}
               cancel={() => setIsShowModalHomePanel(false)}
               title='Create new home image'>
               <HomeAdminModalCreateUpdate
                  editingHome={editingHome}
                  cancel={() => setIsShowModalHomePanel(false)}
                  handleCreateUpdateHome={handleCreateUpdateHome}></HomeAdminModalCreateUpdate>
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
