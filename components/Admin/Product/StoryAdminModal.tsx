import {useState, useEffect, useRef} from 'react';

import {WarningText} from '../common';

import {useFormik} from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import slicePanelLinkName from './slicePanelLinkName';

export const EventSchema = {
   description: Yup.string().required('Vui lòng nhập/paste link sản phẩm cho Story!'),
   pictures: Yup.mixed().required('picture is required'),
};

export default function StoryAdminModal({
   ok = () => {},
   cancel = () => {},
   handleCreateUpdateStory,
   editingStory,
}: any) {
   // check user change images or not -> to send formData or just body
   const [isChangeImage, setIsChangeImage] = useState(false);
   //create image
   const [imageFiles, setImageFiles] = useState<any>([]);
   const [imgesURL, setImagesURL] = useState(editingStory?.pictures || []);

   const inputFilesRef = useRef(null);

   const initStoryValue = {
      description: slicePanelLinkName(editingStory?.description) || '',
      pictures: editingStory?.pictures || '',
   };

   const formik = useFormik({
      initialValues: initStoryValue,
      validationSchema: Yup.object(EventSchema),
      onSubmit: (values) => {
         let story = {
            description: values.description,
            picture: imageFiles[0],
            storyId: editingStory?._id || null,
            isChangeImage: isChangeImage,
         };
         // using for create or update event when image change

         handleCreateUpdateStory(story);
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

   return (
      <div>
         <form autoComplete='off' onSubmit={formik.handleSubmit}>
            <div>Hình ảnh bìa sản phẩm - tỷ lệ 9:16</div>
            <div>Các hình nên có cùng độ phân giải</div>
            <div>Dung lượng &lt; 200KB </div>

            <div className='flex gap-3'>
               <div className='w-1/3 border-[1px] rounded-md relative'>
                  {formik.errors.pictures && formik.touched.pictures && (
                     <WarningText warningText={formik.errors.pictures} />
                  )}

                  <>
                     {imgesURL.length > 0 ? (
                        imgesURL.map((imgURL, index) => (
                           <img src={imgURL} alt='image' key={index} />
                        ))
                     ) : (
                        <button
                           className='absolute p-5 text-[4rem] hover:text-[5rem] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transition-all'
                           onClick={(e) => {
                              e.preventDefault();
                              inputFilesRef.current.click();
                           }}>
                           +
                        </button>
                     )}
                  </>

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

               <div className='w-2/3 flex flex-col gap-3'>
                  {/* description */}
                  <div>
                     <label htmlFor=''>Link sản phẩm</label>
                     <textarea
                        name='description'
                        placeholder='/product/ao-quan-1368174988493'
                        className='w-full border-2 px-2 py-1 rounded-md'
                        value={formik.values.description}
                        onChange={formik.handleChange}
                     />
                     {formik.errors.description && formik.touched.description && (
                        <WarningText warningText={formik.errors.description} />
                     )}
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
