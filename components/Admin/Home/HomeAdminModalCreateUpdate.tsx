import {useState, useEffect, useRef} from 'react';

import {WarningText} from '../common';

import {useFormik} from 'formik';
import * as Yup from 'yup';
import {PANEL_FOR_HOME} from '../../../store/panel/panelSlice';
import {toast} from 'react-toastify';
import getLinkHomePanel from './getLinkHomePanel';

export const EventSchema = {
   link1: Yup.string(),
   link2: Yup.string(),
   link3: Yup.string(),
   link4: Yup.string(),

   pictures: Yup.mixed().required('Upload 4 pictures'),
};

export default function HomeAdminModalCreateUpdate({
   ok = () => {},
   cancel = () => {},
   handleCreateUpdateHome,
   editingHome,
}: any) {
   // const edittingHome

   // check user change images or not -> to send formData or just body
   const [isChangeImage, setIsChangeImage] = useState(false);
   //create image
   const [imageFiles, setImageFiles] = useState<any>([]);
   const [imgesURL, setImagesURL] = useState(editingHome?.pictures || []);

   const inputFilesRef = useRef(null);
   const homePanelLink = getLinkHomePanel(editingHome?.description || '');

   const initHomePanelValue = {
      link1: homePanelLink[0] !== '' ? homePanelLink[0] : '',
      link2: homePanelLink[1] !== '' ? homePanelLink[1] : '',
      link3: homePanelLink[2] !== '' ? homePanelLink[2] : '',
      link4: homePanelLink[3] !== '' ? homePanelLink[3] : '',
      pictures: editingHome?.pictures || '',
   };

   const formik = useFormik({
      initialValues: initHomePanelValue,
      validationSchema: Yup.object(EventSchema),
      onSubmit: (values) => {
         if (isChangeImage && imageFiles.length !== 4) {
            toast.error('Upload 4 pictures!!!');
         } else {
            const description = `${PANEL_FOR_HOME}[${values.link1},${values.link2},${values.link3},${values.link4}]`;

            let homePanel = {
               description: description,
               pictures: imageFiles,
               homPanelId: editingHome?._id || null,
               isChangeImage: isChangeImage,
            };

            // panel-for-home[link1,link2,link3,link4,o]
            // using for create or update event when image change

            handleCreateUpdateHome(homePanel);
         }
         // panel-for-home
      },
   });

   // function click upload file

   function handleResetImg() {
      setImageFiles([]);
      setImagesURL([]);

      setIsChangeImage(true);
   }

   function handleUploadImages(e: any) {
      const tempImgFiles = [];
      const tempImgURL = [];
      setIsChangeImage(true);

      [...e.target.files].forEach((file) => {
         tempImgFiles.push(file);
         tempImgURL.push(URL.createObjectURL(file));
      });

      setImageFiles(tempImgFiles);
      setImagesURL(tempImgURL);
   }

   // check files length by manual

   return (
      <div>
         <form autoComplete='off' onSubmit={formik.handleSubmit}>
            <div className='text-[blue] italic text-[0.9rem] mb-2'>
               <p>*Chọn 4 hình</p>
               <p>*Các hình nên có cùng độ phân giải</p>
            </div>

            <div className='flex flex-col gap-3'>
               <div className='border-[1px] rounded-md relative min-h-[100px] p-2'>
                  {formik.errors.pictures && formik.touched.pictures && (
                     <WarningText warningText={formik.errors.pictures} />
                  )}

                  {/* button add picture update */}
                  <>
                     {imgesURL.length > 0 ? (
                        <div className='grid grid-cols-4 gap-3'>
                           {imgesURL.map((imgURL, index) => (
                              <img
                                 src={imgURL}
                                 alt='image'
                                 key={index}
                                 className='w-200px h-[auto] object-fill'
                              />
                           ))}
                        </div>
                     ) : (
                        <button
                           className='flex items-center absolute p-5 text-[4rem] hover:text-[5rem] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transition-all'
                           onClick={(e) => {
                              e.preventDefault();
                              inputFilesRef.current.click();
                           }}>
                           + <span className='text-[1rem]'>(Add pictures)</span>
                        </button>
                     )}
                  </>

                  {/* button clear picture update */}
                  {imgesURL.length > 0 && (
                     <button
                        className='absolute text-gray-300 hover:text-gray-900 text-[2rem] top-[-10px] right-[10px] transition-all'
                        onClick={() => {
                           handleResetImg();
                           formik.values.pictures = '';
                        }}>
                        x
                     </button>
                  )}

                  {/* input hidden */}
                  <div>
                     <input
                        name='pictures'
                        type='file'
                        accept='image/*'
                        multiple
                        hidden
                        onChange={(e) => {
                           formik.handleChange(e);
                           handleUploadImages(e);
                        }}
                        ref={inputFilesRef}
                     />
                  </div>
               </div>

               <div className='grid grid-cols-2 gap-3'>
                  {/* Link liên kết home panel */}
                  <div>
                     <label htmlFor=''>Nhập link liên kết 1</label>
                     <textarea
                        name='link1'
                        placeholder='/product/ao-quan-136817498849 &#10;'
                        className='w-full border-2 px-2 py-1 rounded-md placeholder:text-[0.9rem]'
                        value={formik.values.link1}
                        onChange={formik.handleChange}
                        rows={3}></textarea>
                  </div>

                  <div>
                     <label htmlFor=''>Nhập link liên kết 2</label>
                     <textarea
                        name='link2'
                        placeholder='/product/ao-quan-1368174988493 '
                        className='w-full border-2 px-2 py-1 rounded-md placeholder:text-[0.9rem]'
                        value={formik.values.link2}
                        onChange={formik.handleChange}
                        rows={3}
                     />
                  </div>
                  <div>
                     <label htmlFor=''>Nhập link liên kết 3</label>
                     <textarea
                        name='link3'
                        placeholder='/product/ao-quan-1368174988493'
                        className='w-full border-2 px-2 py-1 rounded-md placeholder:text-[0.9rem]'
                        value={formik.values.link3}
                        onChange={formik.handleChange}
                        rows={3}
                     />
                  </div>
                  <div>
                     <label htmlFor=''>Nhập link liên kết 4</label>
                     <textarea
                        name='link4'
                        placeholder='/product/ao-quan-1368174988493'
                        className='w-full border-2 px-2 py-1 rounded-md placeholder:text-[0.9rem]'
                        value={formik.values.link4}
                        onChange={formik.handleChange}
                        rows={3}
                     />
                  </div>
               </div>
            </div>

            <div className='flex gap-2 justify-center my-2 border-t-2 pt-2'>
               <button
                  type='submit'
                  className='bg-black hover:bg-[green] min-w-[100px] py-2 rounded-lg text-white'>
                  ok
               </button>
               <button
                  className='hover:bg-[#891a1c] bg-black min-w-[100px] py-2 rounded-lg text-white'
                  onClick={cancel}>
                  cancel
               </button>
            </div>
         </form>
      </div>
   );
}
