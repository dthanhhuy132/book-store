import {useEffect, useState} from 'react';

import {AiOutlinePlusCircle} from 'react-icons/ai';
import {toast} from 'react-toastify';
import {useAppDispatch, useAppSelector} from '../../../store';
import {
   createPanelAsyns,
   getAllPanelAsync,
   udpatePanelAsync,
} from '../../../store/panel/panelAsyncAction';
import LoadingActionPage from '../../common/LoadingPage';
import AdminModal from '../AdminModal';
import {AdminButton} from '../common';
import StoryAdminModal from './StoryAdminModal';

import Cookies from 'js-cookie';
import {PANEL_FOR_STORY} from '../../../store/panel/panelSlice';
const accessToken = Cookies.get('accessToken');

export default function AdminProductStory({storyList}) {
   const dispatch = useAppDispatch();
   const [renderStoryList, setRenderStoryList] = useState(storyList);
   const [showModalForStory, setIsShowModalForStory] = useState(false);

   // get storyList from redux
   const {panelForStoryState} = useAppSelector((state) => state.panel);

   const [isShowLoading, setIsShowLoading] = useState(false);

   const [editingStory, setEditingStory] = useState(null);

   function handleCreateUpdateStory(story) {
      const {description, picture, storyId, isChangeImage} = story;

      // update story
      if (storyId) {
         // xóa id rồi cập nhật
         // 1. cập nhật có hình
         // 2. cập nhật không hình

         if (isChangeImage) {
            const data = new FormData();
            data.append('description', description);

            picture.forEach((pic) => {
               data.append('picture', pic);
            });

            dispatch(udpatePanelAsync({accessToken, storyId, data})).then((res) => {
               if (res.payload.ok) {
                  dispatch(getAllPanelAsync());
                  setIsShowModalForStory(false);
               } else {
                  toast.error(res.payload.message);
               }
               setIsShowLoading(false);
            });
         } else {
            const data = {description};
            dispatch(udpatePanelAsync({accessToken, storyId, data})).then((res) => {
               if (res.payload.ok) {
                  dispatch(getAllPanelAsync());
                  setIsShowModalForStory(false);
               } else {
                  toast.error(res.payload.messsage);
               }
               setIsShowLoading(false);
            });
         }
      }

      // create new story
      if (!storyId) {
         setIsShowLoading(true);
         const formData = new FormData();
         const descriptionForStory = `${PANEL_FOR_STORY}${description}`;
         formData.append('description', descriptionForStory);
         formData.append('pictures', picture);

         dispatch(createPanelAsyns({accessToken, formData})).then((res) => {
            setIsShowLoading(false);

            if (res.payload.ok) {
               dispatch(getAllPanelAsync());
               setIsShowModalForStory(false);
            } else {
               toast.error(res.payload.message);
            }
            setIsShowLoading(false);
         });
      }
   }

   function handleClickStoryItem(story) {
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
         setRenderStoryList(panelForStoryState);
      }
   }, [panelForStoryState]);

   return (
      <>
         <div className='flex gap-10 items-center'>
            <AdminButton click={() => setIsShowModalForStory(true)}>
               <AiOutlinePlusCircle /> Create New Story
            </AdminButton>
         </div>

         {/* {renderStoryList.length > 0 ? (
            <>
               {renderStoryList.map((item) => (
                  <div key={index}>storyItem</div>
               ))}
            </>
         ) : (
            <p className='mt-2'>Chưa có story</p>
         )} */}

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
      </>
   );
}
