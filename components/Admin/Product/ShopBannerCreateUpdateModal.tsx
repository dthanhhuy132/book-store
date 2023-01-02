import {useState, useEffect, useRef} from 'react';

import {WarningText} from '../common';

import {useFormik} from 'formik';
import * as Yup from 'yup';
import {PANEL_FOR_BANNER} from '../../../store/panel/panelSlice';
import {toast} from 'react-toastify';
import getLinkHomePanel from '../Home/getLinkHomePanel';

export const BannerSchema = {
   link: Yup.string(),
   pictures: Yup.mixed().required('Upload pictures'),
};

export default function ShopBannerCreateUpdateModal({
   ok = () => {},
   cancel = () => {},
   handleCreateUpdateHome,
   editingHome,
}: any) {
   // check user change images or not -> to send formData or just body
   const [isChangeImage, setIsChangeImage] = useState(false);
   //create image
   const [imageFiles, setImageFiles] = useState<any>([]);
   const [imageFilesPC, setImageFilesPC] = useState<any>([]);
   const [imgesURL, setImagesURL] = useState(
      editingHome?.pictures.slice(0, editingHome?.pictures.length / 2) || []
   );
   const [imgesPCURL, setImagesPCURL] = useState(
      editingHome?.pictures.slice(editingHome?.pictures.length / 2, editingHome?.pictures.length) ||
         []
   );

   const inputFilesRef = useRef(null);
   const inputFilesPCRef = useRef(null);

   // logic is the same with create home
   const homePanelLink = getLinkHomePanel(editingHome?.description || '');

   const initHomePanelValue = {
      link: homePanelLink[0] !== '' ? homePanelLink[0] : '',
      pictures: editingHome?.pictures || '',
   };

   console.log('editingHome trong banner', editingHome);

   // formik check
   const formik = useFormik({
      initialValues: initHomePanelValue,
      validationSchema: Yup.object(BannerSchema),
      onSubmit: (values) => {
         if (
            (isChangeImage && imageFiles.length == 0) ||
            (isChangeImage &&
               (imageFilesPC.length == 0 || imageFiles.length !== imageFilesPC.length))
         ) {
            toast.error('Kiểm tra lại các hình ảnh upload');
         } else {
            const description = `${PANEL_FOR_BANNER}[${values.link}]`;

            let homePanel = {
               description: description,
               pictures: [...imageFiles, ...imageFilesPC],
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

   // function handleUpload Image for Mobile
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

   // function handleUpload Image for Mobile
   function handleUploadImagesForPC(e: any) {
      const tempImgFiles = [];
      const tempImgURL = [];
      setIsChangeImage(true);

      [...e.target.files].forEach((file) => {
         tempImgFiles.push(file);
         tempImgURL.push(URL.createObjectURL(file));
      });

      setImageFilesPC(tempImgFiles);
      setImagesPCURL(tempImgURL);
   }
   // function reset upload file
   function handleResetImg() {
      setImageFiles([]);
      setImagesURL([]);

      setIsChangeImage(true);
   }

   function handleResetImgPC() {
      setImageFilesPC([]);
      setImagesPCURL([]);

      setIsChangeImage(true);
   }

   return (
      <div>
         <form autoComplete='off' onSubmit={formik.handleSubmit}>
            <div className='text-[blue] italic text-[0.9rem] mb-2'>
               <p>- Các hình nên có cùng độ phân giải</p>
               <p>- Số lượng hình trên Mobile và PC phải bằng nhau</p>
            </div>

            {/* --------------------------------> upload image for Mobile */}
            <p>Upload hình ảnh Banner cho mobile</p>
            <div className='flex flex-col gap-3'>
               <div className='border-[1px] rounded-md relative min-h-[100px] p-2'>
                  {formik.errors.pictures && formik.touched.pictures && (
                     <WarningText warningText={formik.errors.pictures} />
                  )}

                  {/* button add picture update for mobile*/}
                  <>
                     {imgesURL.length > 0 ? (
                        <div className='flex gap-2 w-full justify-center'>
                           {imgesURL.map((imgURL, index) => (
                              <div key={index}>
                                 <span>{index + 1}</span>
                                 <img src={imgURL} alt='image' className='h-[250px]' />
                              </div>
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

               {/* --------------------------------> upload image for PC */}
               <p className='mt-5'>Upload hình ảnh Banner cho PC</p>
               <div className='border-[1px] rounded-md relative min-h-[100px] p-2'>
                  {formik.errors.pictures && formik.touched.pictures && (
                     <WarningText warningText={formik.errors.pictures} />
                  )}

                  {/* button add picture update for PC*/}
                  <>
                     {imgesPCURL.length > 0 ? (
                        <div className='flex gap-2 w-full justify-center'>
                           {imgesPCURL.map((imgURL, index) => (
                              <div key={index}>
                                 <span>{index + 1}</span>
                                 <img src={imgURL} alt='image' className='w-[200px]' />
                              </div>
                           ))}
                        </div>
                     ) : (
                        <button
                           className='flex items-center absolute p-5 text-[4rem] hover:text-[5rem] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transition-all'
                           onClick={(e) => {
                              e.preventDefault();
                              inputFilesPCRef.current.click();
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
                           handleResetImgPC();
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
                           handleUploadImagesForPC(e);
                        }}
                        ref={inputFilesPCRef}
                     />
                  </div>
               </div>

               <div className='w-2/3 mx-auto '>
                  {/* Link liên kết home panel */}
                  <div>
                     <div className='text-[blue] italic text-[0.9rem] mb-2'>
                        <p>- Link liên kết theo số thứ tự hình</p>
                        <p>- Hình ảnh không có link liên kết Xuống dòng cho hình đó</p>
                        <p>- Số lượng link liên kết phải bằng số lượng hình ảnh</p>
                        <p>- Link hình ảnh: 1. /product/hat-giong-tam-hon...</p>
                     </div>
                     <label htmlFor=''>Nhập link liên kết</label>
                     <textarea
                        name='link'
                        placeholder={`1. /product/cuon-theo-chieu-gio-136817498849 \n2. /category/noi-bat-136817316324 \n3. /event/su-kien-thang-1...`}
                        className='w-full border-2 px-2 py-1 rounded-md placeholder:text-[0.9rem]'
                        value={formik.values.link}
                        onChange={formik.handleChange}
                        rows={3}></textarea>
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
