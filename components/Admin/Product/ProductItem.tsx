import Image from 'next/image';
import {useState} from 'react';
import {AiFillCopy, AiTwotoneEdit} from 'react-icons/ai';
import {RiDeleteBin4Fill} from 'react-icons/ri';

import FormatPrice from '../../../helper/FormatPrice';
import productApi from '../../../service/productApi';
import AdminModal from '../AdminModal';
import {AdminButton} from '../common';

import LoadingActionPage from '../../common/LoadingPage';
import {toast} from 'react-toastify';
import {useDispatch} from 'react-redux';

import Cookies from 'js-cookie';
import {getProductByNameAsync} from '../../../store/product/productAsynAction';
import CopyProductSlug from './copyProductSlug';
import stringToSlug from '../../../helper/stringToSlug';
import LoadingCocozzi from '../../common/LoadingCocozzi';
import productSortSize from './productSorSize';

export default function ProductItem({product, handleClickEditProduct, renderProductList}: any) {
   const accessToken = Cookies.get('accessToken');
   const dispatch = useDispatch();
   const [isShowLoading, setIsShowLoading] = useState(false);
   const [isShowModalDelete, setIsShowModalDelete] = useState(false);
   const sizeAndQuantity = productSortSize(product.size);

   // delete product
   async function handleDeleteProduct() {
      if (renderProductList.length === 1) {
         toast.warning('Không thể xóa sản phẩm cuối cùng => Vui lòng tạo sản phẩm mới và xóa lại');
         setIsShowModalDelete(false);

         return;
      }
      setIsShowLoading(true);

      const productId = product.productID;

      Promise.all(productId.map((id) => productApi.deleteProduct(accessToken, id))).then((res) => {
         if (res.some((item) => item >= 400)) {
            toast.error('có lỗi xảy ra, vui lòng kiểm tra lại tên sản phẩm, hoặc kết nối mạng');
            setIsShowModalDelete(false);
            setIsShowLoading(false);
         } else {
            dispatch(getProductByNameAsync()).then((res) => {
               if (res.payload.ok) {
                  setIsShowModalDelete(false);
                  setIsShowLoading(false);
               } else {
                  toast.warning('Vui lòng tải lại trang để cập nhật sản phẩm');
                  setIsShowModalDelete(false);
               }
            });
         }

         setIsShowLoading(false);
      });
   }

   return (
      <>
         <div>
            {/* product info */}
            <div>
               <p className='font-bold'>{product.name}</p>
               <p>
                  <FormatPrice price={product.price} />
               </p>

               {/* size */}
               <div className='flex gap-2'>
                  {sizeAndQuantity.map((item, index) => (
                     <div key={index}>
                        <span className='font-bold'>{item.size}</span>
                        <span>:</span>
                        <span> {item.quantity}</span>
                     </div>
                  ))}
               </div>

               <div className='flex gap-2 mt-2'>
                  {product.colorList
                     .toString()
                     .split(',')
                     .map((color, index) => (
                        <div
                           key={index}
                           className='w-[40px] h-[20px]'
                           style={{backgroundColor: `${color}`}}></div>
                     ))}
               </div>
            </div>

            <div className='relative grid grid-row-2 mt-3'>
               {/* copy product link */}
               <div className='absolute top-1 right-1 opacity-90 z-[1]'>
                  <CopyProductSlug text={`/product/${stringToSlug(product.name)}`} />
               </div>

               {/* product avatar */}
               <img
                  src={product?.pictures ? product?.pictures[0] : ''}
                  alt='Prodcut avatar'
                  className='h-auto w-full'></img>

               {/* product imag list */}
            </div>
         </div>

         {/* more image */}
         <div>
            <div className='flex gap-1 mt-1 w-full overflow-auto'>
               {product?.pictures?.length > 0 &&
                  product.pictures
                     .slice(1, product.pictures.length)
                     .map((img) => (
                        <img
                           key={img}
                           src={img}
                           className='h-[150px] object-cover'
                           alt='Hình ảnh sản phẩm chi tiết'
                        />
                     ))}
            </div>

            <div className='flex justify-between mt-2'>
               <AdminButton
                  // pending function update product
                  click={() => handleClickEditProduct(product)}
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
            </div>
         </div>

         {isShowModalDelete && (
            <AdminModal
               ok={handleDeleteProduct}
               cancel={() => setIsShowModalDelete(false)}
               title={`Bạn có muốn xóa sản phẩm: ${product.name}`}></AdminModal>
         )}

         {isShowLoading && <LoadingCocozzi color='black' />}
      </>
   );
}
