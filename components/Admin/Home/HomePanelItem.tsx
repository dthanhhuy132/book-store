import {useState} from 'react';

import {AiTwotoneEdit} from 'react-icons/ai';
import {RiDeleteBin4Fill} from 'react-icons/ri';
import {useAppDispatch} from '../../../store';
import {AdminButton} from '../common';

import Cookies from 'js-cookie';
import {deletePanelAsync, getAllPanelAsync} from '../../../store/panel/panelAsyncAction';
import {toast} from 'react-toastify';
import AdminModal from '../AdminModal';
import LoadingActionPage from '../../common/LoadingPage';
import getLinkHomePanel from './getLinkHomePanel';
const accessToken = Cookies.get('accessToken');

export default function HomePanaleItem({
   index,
   homePanel,
   handleClickEditHomePanel = () => {},
}: any) {
   const dispatch = useAppDispatch();
   const [isShowModalDelete, setIsShowModalDelete] = useState(false);
   const [isShowLoading, setIsShowLoading] = useState(false);

   const homePanelLink = homePanel.description;

   function handleDeleteStory() {
      setIsShowLoading(true);
      const panelId = homePanel._id;
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

   console.log('getLinkHomePanel(homePanelLink)', getLinkHomePanel(homePanelLink));
   return (
      <>
         <div className='flex items-center gap-20 mb-2'>
            <div className='flex justify-center items-center'>
               {index + 1}.
               {index === 0 && (
                  <p className='rounded-xl flex justify-center items-center bg-green-400 px-2 ml-2'>
                     Active
                  </p>
               )}
            </div>

            <div className='flex justify-between gap-2 mt-2'>
               <AdminButton
                  click={() => handleClickEditHomePanel(homePanel)}
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
         <div key={homePanel._id} className='grid grid-cols-4 gap-2 whitespace-nowrap'>
            {homePanel?.pictures?.length > 0 &&
               homePanel.pictures.map((pic, index) => (
                  <div className='flex flex-col' key={pic}>
                     <img src={pic} alt='Hình ảnh panel' key={pic}></img>
                     {getLinkHomePanel(homePanelLink)[index] && (
                        <div className='text-[0.9rem] px-2'>
                           <span className='font-bold'>Link liên kết:</span>
                           <p className='whitespace-pre-wrap'>
                              {getLinkHomePanel(homePanelLink)[index]}
                           </p>
                        </div>
                     )}
                  </div>
               ))}
         </div>

         {isShowModalDelete && (
            <AdminModal
               ok={handleDeleteStory}
               cancel={() => setIsShowModalDelete(false)}
               title='Bạn chắc chắn muốn xóa Panel này?'></AdminModal>
         )}

         {isShowLoading && <LoadingActionPage />}
      </>
   );
}
