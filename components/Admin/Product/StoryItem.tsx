import {useState} from 'react';

import {AiTwotoneEdit} from 'react-icons/ai';
import {RiDeleteBin4Fill} from 'react-icons/ri';
import {deletePanelAsync, getAllPanelAsync} from '../../../store/panel/panelAsyncAction';
import LoadingActionPage from '../../common/LoadingPage';
import AdminModal from '../AdminModal';
import {AdminButton} from '../common';
import slicePanelLinkName from './slicePanelLinkName';

import {toast} from 'react-toastify';
import {useDispatch} from 'react-redux';

import Cookies from 'js-cookie';
const accessToken = Cookies.get('accessToken');

export default function StoryItem({story, handleClickEditStory = () => {}}: any) {
   const dispatch = useDispatch();
   const [isShowModalDelete, setIsShowModalDelete] = useState(false);
   const [isShowLoading, setIsShowLoading] = useState(false);

   function handleDeleteStory() {
      setIsShowLoading(true);
      const panelId = story._id;
      dispatch(deletePanelAsync({accessToken, panelId})).then((res) => {
         if (res.payload.ok) {
            dispatch(getAllPanelAsync());
         } else {
            toast.error(res.payload.message);
         }
         setIsShowLoading(false);
         setIsShowModalDelete(false);
      });
   }

   return (
      <div className='flex flex-col justify-between border-[1px] p-1'>
         <div>
            <img src={story.pictures[0]} alt='' />
            <p>
               Link liên kết:{' '}
               <span className='font-bold'>{slicePanelLinkName(story.description)}</span>
            </p>
         </div>
         <div className='mt-5'>
            <div className='flex justify-between mt-2'>
               <AdminButton
                  click={() => handleClickEditStory(story)}
                  className='py-[4px] w-[80px] flex justify-center'>
                  <AiTwotoneEdit fontSize='1rem' />
                  Edit
               </AdminButton>
               <AdminButton
                  click={() => setIsShowModalDelete(true)}
                  className='py-[4px] w-[80px] flex justify-center'
                  type='delete'>
                  <RiDeleteBin4Fill fontSize='1.5rem' />
                  Delete
               </AdminButton>

               {/* modal delete confirm */}
            </div>
         </div>

         {isShowModalDelete && (
            <AdminModal
               ok={handleDeleteStory}
               cancel={() => setIsShowModalDelete(false)}
               title={`Bạn có muốn xóa story: ${slicePanelLinkName(
                  story.description
               )}}`}></AdminModal>
         )}

         {isShowLoading && <LoadingActionPage />}
      </div>
   );
}
