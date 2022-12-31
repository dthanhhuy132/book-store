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
import getLinkHomePanel, {getLinkBannerPanel} from '../Home/getLinkHomePanel';
const accessToken = Cookies.get('accessToken');

export default function BannerShopItem({
   index,
   homePanel,
   handleClickEditBannerPanel = () => {},
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
                  click={() => handleClickEditBannerPanel(homePanel)}
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
         <div key={homePanel._id} className='flex flex-col gap-2 whitespace-nowrap'>
            <div className='flex'>
               {homePanel?.pictures?.length > 0 &&
                  homePanel.pictures.slice(0, homePanel.pictures.length / 2).map((pic, index) => (
                     <div className='flex flex-col gap-1 my-2' key={pic}>
                        <img src={pic} alt='Hình ảnh panel'></img>
                        <span className='font-bold'>Link liên kết:</span>
                        {getLinkBannerPanel(homePanelLink)[index] && (
                           <div className='flex text-[0.9rem] px-2'>
                              <p className='whitespace-pre-wrap'>
                                 {getLinkBannerPanel(homePanelLink)[index]}
                              </p>
                           </div>
                        )}
                     </div>
                  ))}
            </div>

            <div className='flex gap-1'>
               {homePanel.pictures
                  .slice(homePanel.pictures.length / 2, homePanel.pictures.length)
                  .map((pic, index) => (
                     <div className='flex flex-col' key={pic}>
                        <img src={pic} alt='Hình ảnh panel' key={pic}></img>
                     </div>
                  ))}
            </div>
         </div>

         {isShowModalDelete && (
            <AdminModal
               ok={handleDeleteStory}
               cancel={() => setIsShowModalDelete(false)}
               title='Bạn chắc chắn muốn xóa Banner này?'></AdminModal>
         )}

         {isShowLoading && <LoadingActionPage />}
      </>
   );
}
