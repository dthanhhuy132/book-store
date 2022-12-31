import {useEffect, useState} from 'react';

import {AiOutlinePlusCircle} from 'react-icons/ai';
import {toast} from 'react-toastify';

import Cookies from 'js-cookie';
import {useAppDispatch, useAppSelector} from '../../store';
import {
   createPanelAsyns,
   getAllPanelAsync,
   udpatePanelAsync,
} from '../../store/panel/panelAsyncAction';
import {PANEL_FOR_STORY} from '../../store/panel/panelSlice';
import {AdminButton} from '../../components/Admin/common';
import {AdminLayout, AdminModal} from '../../components/Admin';
import StoryAdminModal from '../../components/Admin/Product/StoryAdminModal';
import LoadingActionPage from '../../components/common/LoadingPage';
import panelApi from '../../service/panelApi';
import slicePanelLinkName from '../../components/Admin/Product/slicePanelLinkName';
import StoryItem from '../../components/Admin/Product/StoryItem';
import sortDataByUpdatedTime from '../../components/Admin/common/sortDataByUpdatedTime';
const accessToken = Cookies.get('accessToken');

export default function AdminStoryPage({storyList}) {
   const dispatch = useAppDispatch();
   const [renderStoryList, setRenderStoryList] = useState(storyList);

   const [showModalForStory, setIsShowModalForStory] = useState(false);

   // get storyList from redux
   const {panelForStoryState} = useAppSelector((state) => state.panel);

   const [isShowLoading, setIsShowLoading] = useState(false);

   const [editingStory, setEditingStory] = useState(null);

   function handleCreateUpdateStory(story) {
      setIsShowLoading(true);

      const {description, picture, storyId, isChangeImage} = story;
      // update story
      if (storyId) {
         // xóa id rồi cập nhật
         // 1. cập nhật có hình
         // 2. cập nhật không hình

         const panelId = storyId;
         if (isChangeImage == true) {
            const data = new FormData();
            data.append('description', `${PANEL_FOR_STORY}${description}`);
            data.append('pictures', picture);

            dispatch(udpatePanelAsync({accessToken, panelId, data})).then((res) => {
               setIsShowLoading(false);
               if (res.payload.ok) {
                  dispatch(getAllPanelAsync());
                  setIsShowModalForStory(false);
               } else {
                  toast.error(res.payload.message);
               }
            });
         } else {
            const data = {description: `${PANEL_FOR_STORY}${description}`};
            dispatch(udpatePanelAsync({accessToken, panelId, data})).then((res) => {
               setIsShowLoading(false);
               if (res.payload.ok) {
                  dispatch(getAllPanelAsync());
                  setIsShowModalForStory(false);
               } else {
                  toast.error(res.payload.messsage);
               }
            });
         }
      }

      // create new story
      if (!storyId) {
         const formData = new FormData();
         const descriptionForStory = `${PANEL_FOR_STORY}${description}`;
         formData.append('description', descriptionForStory);
         formData.append('pictures', picture);

         dispatch(createPanelAsyns({accessToken, formData})).then((res) => {
            if (res.payload.ok) {
               setIsShowModalForStory(false);
               dispatch(getAllPanelAsync());
            } else {
               toast.error(res.payload.message);
            }
         });

         setIsShowLoading(false);
      }
   }

   function handleClickEditStory(story) {
      setIsShowModalForStory(true);
      setEditingStory(story);
   }

   // reset editing story
   useEffect(() => {
      if (!showModalForStory) {
         setEditingStory(null);
      }
   }, [showModalForStory]);

   // update render event list
   useEffect(() => {
      if (panelForStoryState || panelForStoryState?.length > 0) {
         const sortStoryState = sortDataByUpdatedTime(panelForStoryState);
         setRenderStoryList(sortStoryState);
      }
   }, [panelForStoryState]);

   return (
      <AdminLayout>
         <div className='flex gap-10 items-center'>
            <AdminButton click={() => setIsShowModalForStory(true)}>
               <AiOutlinePlusCircle /> Create New Story
            </AdminButton>
         </div>
         <h2 className='mt-5 font-extrabold text-[1.2rem]'>Story list</h2>
         {renderStoryList?.length > 0 ? (
            <div className='grid grid-cols-4 mt-5 gap-10'>
               {renderStoryList.map((story) => (
                  <StoryItem
                     story={story}
                     key={story._id}
                     handleClickEditStory={handleClickEditStory}></StoryItem>
               ))}
            </div>
         ) : (
            <p className='mt-2'>Chưa có story</p>
         )}

         {showModalForStory && (
            <AdminModal
               title={`${editingStory ? 'Edit story' : 'Create new story'}`}
               showFooter={false}
               className='w-[800px] pb-2'
               cancel={() => setIsShowModalForStory(false)}>
               <StoryAdminModal
                  cancel={() => setIsShowModalForStory(false)}
                  handleCreateUpdateStory={handleCreateUpdateStory}
                  editingStory={editingStory}
               />
            </AdminModal>
         )}
         {isShowLoading && <LoadingActionPage />}
      </AdminLayout>
   );
}

export const getServerSideProps = async () => {
   //   panelList for story
   let storyList;

   try {
      const panelRes = await panelApi.getAllPanel();
      const panelData = panelRes?.data?.data;

      storyList = panelData?.filter((item) => item?.description?.indexOf(PANEL_FOR_STORY) >= 0);
   } catch (error) {}

   return {
      props: {
         storyList: sortDataByUpdatedTime(storyList) || [],
      },
   };
};
