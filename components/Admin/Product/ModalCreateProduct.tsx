import {useState, useEffect, useRef} from 'react';

import {WarningText} from '../common';

import {useFormik} from 'formik';
import * as Yup from 'yup';
import Dropdown from 'react-dropdown';
import {ProductValidateSchema} from './productValidateSchema';
import ProductCreateDescription from './ProductCreateDescription';
import InputPrice from './InputPrice';

export default function ModalCreateProduct({
   ok = () => {},
   cancel = () => {},
   createUpdateProduct,
   categoryList,
   productEditing,
}: any) {
   //create image
   const [productAvatarFile, setProdcutAvatarFile] = useState(productEditing?.pictures[0] || null);
   const [productAvatarURL, setProdcutAvatarURL] = useState(productEditing?.pictures[0] || null);
   const [imageFiles, setImageFiles] = useState<any>(
      productEditing?.pictures.slice(1, productEditing.pictures.length) || []
   );
   const [imgesURL, setImagesURL] = useState(
      productEditing?.pictures.slice(1, productEditing.pictures.length) || []
   );

   const [changeImageUpload, setChangeImageUpload] = useState(false);

   const inputFilesRef = useRef(null);
   const inputFilesAvatarRef = useRef(null);

   // find init category for product
   const [categoryName, setCategoryName] = useState(
      categoryList.filter((item) => item.id === productEditing?.categoryId)[0]?.name || ''
   );

   const initProductValue = {
      name: productEditing?.name || '',
      description: productEditing?.description || '',
      price: productEditing?.price || 0,
      colorList: productEditing?.colorList?.toString() || '',
      avatar: productEditing?.pictures[0] || '',
      pictures: productEditing?.pictures.slice(1, productEditing.pictures.length) || '',
      categoryId: productEditing?.categoryId || '', //using state
      quantity: productEditing?.quantity || 0,
   };

   // console.log('productEditing la gi nao', productEditing);

   const formik = useFormik({
      initialValues: initProductValue,
      validationSchema: Yup.object(ProductValidateSchema),
      onSubmit: (values) => {
         const product = {
            name: values.name,
            price: values.price,
            description: values.description,
            productAvatar: productAvatarFile,
            productPictures: imageFiles,
            categoryId: values.categoryId,
            productId: productEditing?.productID[0] || null,
            changeImageUpload: changeImageUpload,
            quantity: values.quantity,
         };

         createUpdateProduct(product);
      },
   });

   function handleUploadImages(e: any) {
      const tempImgFiles = [];
      const tempImgURL = [];

      [...e.target.files].forEach((file) => {
         tempImgFiles.push(file);
         tempImgURL.push(URL.createObjectURL(file));
      });

      setImageFiles(tempImgFiles);
      setImagesURL(tempImgURL);
   }

   function handleUploadAvatar(e: any) {
      const file = [...e.target.files][0];
      setProdcutAvatarFile(file);
      setProdcutAvatarURL(URL.createObjectURL(file));
   }

   function handleResetAvatar() {
      setProdcutAvatarFile(null);
      setProdcutAvatarURL(null);
      setChangeImageUpload(true);
   }

   // function click upload file
   function handleResetImg() {
      setImageFiles([]);
      setImagesURL([]);
      // -> change update img
      setChangeImageUpload(true);
   }

   useEffect(() => {
      // reset image upload
      if (productEditing?.productID && changeImageUpload) {
         handleResetAvatar();
         handleResetImg();
      }
   }, [changeImageUpload]);

   return (
      <div>
         <form autoComplete='off' onSubmit={formik.handleSubmit}>
            <div>
               {/* avatar và info */}
               <div className='flex gap-3 '>
                  <div className='w-1/3'>
                     <div>Hình ảnh bìa sản phẩm</div>

                     <div className='relative w-full min-h-[300px] border-[1px] rounded-md'>
                        {formik.errors.avatar && formik.touched.avatar && (
                           <WarningText warningText={formik.errors.avatar} />
                        )}
                        <>
                           {productAvatarURL ? (
                              <img src={productAvatarURL} alt='image' />
                           ) : (
                              <button
                                 className='absolute p-5 text-[4rem] hover:text-[5rem] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transition-all'
                                 onClick={(e) => {
                                    e.preventDefault();
                                    inputFilesAvatarRef.current.click();
                                 }}>
                                 +
                              </button>
                           )}
                        </>

                        {productAvatarURL && (
                           <button
                              className='absolute text-gray-300 hover:text-gray-900 text-[2rem] top-[-10px] right-[10px] transition-all'
                              onClick={() => {
                                 handleResetAvatar();
                                 formik.values.avatar = '';
                              }}>
                              x
                           </button>
                        )}

                        <div>
                           {/* input for avatar */}
                           <input
                              name='avatar'
                              type='file'
                              accept='image/*'
                              hidden
                              onChange={(e) => {
                                 formik.handleChange(e);
                                 handleUploadAvatar(e);
                              }}
                              ref={inputFilesAvatarRef}
                           />
                        </div>
                     </div>
                  </div>

                  <div className='w-2/3 flex flex-col gap-3'>
                     {/* name */}
                     <div>
                        <label htmlFor=''>Tên sản phẩm</label>
                        <input
                           name='name'
                           className='w-full border-2 px-2 py-1 rounded-md'
                           value={formik.values.name}
                           onChange={formik.handleChange}
                        />
                        {formik.errors.name && formik.touched.name && (
                           <WarningText warningText={formik.errors.name} />
                        )}
                     </div>

                     {/* description */}
                     <div>
                        <label htmlFor=''>
                           Description - Hình ảnh với dung lượng nhỏ hơn 200kb nên sử dụng webp
                        </label>
                        <ProductCreateDescription
                           value={formik.values.description}
                           onChange={(text) => (formik.values.description = text)}
                        />
                        {formik.errors.description && formik.touched.description && (
                           <WarningText warningText={formik.errors.description} />
                        )}
                     </div>

                     {/* price */}
                     <div>
                        <label htmlFor=''>Giá sản phẩm - VNĐ</label>
                        <input
                           name='price'
                           type='number'
                           className='w-full border-2 px-2 py-1 rounded-md'
                           value={formik.values.price}
                           onChange={formik.handleChange}
                        />

                        {formik.errors.price && formik.touched.price && (
                           <WarningText warningText={formik.errors.price} />
                        )}
                     </div>

                     <div>
                        <label htmlFor=''>Số lượng</label>

                        <input
                           name='quantity'
                           className='w-full border-2 px-2 py-1 rounded-md'
                           type='number'
                           value={formik.values.quantity}
                           onChange={formik.handleChange}
                        />
                        {formik.errors.quantity && formik.touched.quantity && (
                           <WarningText warningText={formik.errors.quantity} />
                        )}
                     </div>

                     {/* category product */}
                     <div>
                        <label htmlFor=''>Nhóm phân loại (Chọn 1 category cho sản phẩm)</label>
                        <Dropdown
                           options={categoryList.map((item) => item.name)}
                           onChange={(e) => {
                              let id = categoryList.filter((item) => item.name === e.value)[0].id;
                              formik.values.categoryId = id;
                              setCategoryName(e.value);
                           }}
                           value={categoryName}
                           placeholder='Select category for product'
                        />

                        {formik.errors.categoryId && formik.touched.categoryId && (
                           <WarningText warningText={formik.errors.categoryId} />
                        )}
                     </div>
                  </div>
               </div>

               {/* hình ảnh sản phẩm */}
               <div className='mt-3'>
                  <p>Hình ảnh sản phẩm (Các hình ảnh phải có cùng tỷ lệ)</p>
                  <div className='border-[1px] rounded-md relative min-h-[200px]'>
                     {formik.errors.pictures && formik.touched.pictures && (
                        <WarningText warningText={formik.errors.pictures} />
                     )}
                     <div className='p-1 flex flex-wrap gap-1'>
                        {imgesURL.length > 0 ? (
                           imgesURL.map((imgURL, index) => (
                              <img
                                 src={imgURL}
                                 alt='image'
                                 key={index}
                                 className='h-[100%] w-[100px]'
                              />
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
                     </div>

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
                              handleUploadImages(e);
                              formik.handleChange(e);
                           }}
                           ref={inputFilesRef}
                        />
                     </div>
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
