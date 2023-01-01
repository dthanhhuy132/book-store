import {time} from 'console';
import {useState, useEffect} from 'react';

import {AiOutlinePlusCircle} from 'react-icons/ai';
import {AdminLayout, AdminModal} from '../../components/Admin';
import {AdminButton} from '../../components/Admin/common';
import {ProductItem, ProductTab} from '../../components/Admin/Product';
import ModalCreateProduct from '../../components/Admin/Product/ModalCreateProduct';
import categoryApi from '../../service/categoryApi';
import productApi from '../../service/productApi';

import Cookies from 'js-cookie';
import filterProductActive from '../../helper/filterProductActive';
import LoadingActionPage from '../../components/common/LoadingPage';
import {useAppDispatch, useAppSelector} from '../../store';
import {
   createNewProduct,
   getProductByNameAsync,
   updateProduct,
} from '../../store/product/productAsynAction';
import {toast} from 'react-toastify';
import sortDataByUpdatedTime from '../../components/Admin/common/sortDataByUpdatedTime';
import useCheckDuplicateName from '../../components/Admin/Product/useCheckDuplicateName';

export default function AdminProductPage({productList, categoryList, productOrigin}) {
   const accessToken = Cookies.get('accessToken');
   console.log('productOrigin', filterProductActive(productOrigin));

   const [productEditing, setProductEditing] = useState(null);
   const [isShowLoading, setIsShowLoading] = useState(false);

   const [renderProductList, setRenderProductList] = useState(sortDataByUpdatedTime(productList));

   const {productListState} = useAppSelector((state) => state.product);

   const [isShowModalCreatelProduct, setIsShowModalCreateProduct] = useState(false);

   const dispatch = useAppDispatch();

   // create and update product function
   function createUpdateProduct(product) {
      const {
         name,
         description,
         price,
         categoryId,
         productAvatar,
         productPictures,
         productId,
         quantity,
         changeImageUpload,
      } = product;

      // Chỉnh sửa sản phẩm đang được phát triển

      // Chỉnh sửa lại: id sản phẩm, số lượng, size
      // new khoong cos size -> tajo moiw sanr phama
      // ---------------> Chỉnh sửa sản phẩm nè

      // ---------------> Tên sản phẩm là độc nhât vô nhị

      if (productId) {
         setIsShowLoading(true);
         //   thay đôi hình ảnh sản phẩm
         if (changeImageUpload === true) {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('idCategory', categoryId);
            formData.append('description', description);
            formData.append('price', price);

            // Yêu cầu từ Api
            formData.append('colorList[0]', '#fff');
            formData.append('size', 'ML');

            formData.append('pictures', productAvatar);
            productPictures.forEach((pic) => formData.append('pictures', pic));
            formData.append('quantity', quantity);

            dispatch(updateProduct({accessToken, productId, formData})).then((res) => {
               if ((res) => res.payload.ok) {
                  dispatch(getProductByNameAsync()).then((res) => {
                     if (res.payload.ok) {
                        setIsShowModalCreateProduct(false);
                        setIsShowLoading(false);
                        toast.success('Cập nhật sản phẩm thành công!');
                     } else {
                        toast.warning('Vui lòng tải lại trang để cập nhật sản phẩm');
                        setIsShowLoading(false);
                     }
                  });
               } else {
                  toast.error(
                     'có lỗi xảy ra, vui lòng kiểm tra lại tên sản phẩm, hoặc kết nối mạng'
                  );
               }
            });
         }

         if (changeImageUpload === false) {
            const formData = {
               name,
               description,
               price,
               categoryId,
               quantity: quantity,
            };

            dispatch(updateProduct({accessToken, productId, formData})).then((res) => {
               if ((res) => res.payload.ok) {
                  dispatch(getProductByNameAsync()).then((res) => {
                     if (res.payload.ok) {
                        setIsShowModalCreateProduct(false);
                        setIsShowLoading(false);
                        toast.success('Cập nhật sản phẩm thành công!');
                     } else {
                        toast.warning('Vui lòng tải lại trang để cập nhật sản phẩm');
                        setIsShowLoading(false);
                     }
                  });
               } else {
                  toast.error(
                     'có lỗi xảy ra, vui lòng kiểm tra lại tên sản phẩm, hoặc kết nối mạng'
                  );
               }
            });
         }
      }

      // ------------------------------------------------> TẠO MỚI SẢN PHẨM
      if (!productId) {
         setIsShowLoading(true);

         const formData = new FormData();
         formData.append('name', name);
         formData.append('idCategory', categoryId);
         formData.append('description', description);
         formData.append('price', price);

         // Yêu cầu từ Api
         formData.append('colorList[0]', '#fff');
         formData.append('size', 'ML');

         formData.append('pictures', productAvatar);
         productPictures.forEach((pic) => formData.append('pictures', pic));
         formData.append('quantity', quantity);

         dispatch(createNewProduct({accessToken, formData})).then((res) => {
            if (res.some((item: any) => item >= 400)) {
               toast.error('Có lỗi xảy ra, vui lòng kiểm tra lại tên sản phẩm, hoặc kết nối mạng');
            } else {
               dispatch(getProductByNameAsync()).then((res) => {
                  if (res.payload.ok) {
                     setIsShowModalCreateProduct(false);
                     setIsShowLoading(false);
                     toast.success('Tạo sản phẩm thành công! Vui lòng chờ để sản phẩm hiển thị');
                  } else {
                     toast.warning('Vui lòng tải lại trang để cập nhật sản phẩm');
                     setIsShowLoading(false);
                  }
               });
            }
         });
      }
   }

   function handleClickEditProduct(editProduct) {
      setIsShowModalCreateProduct(true);
      setProductEditing(editProduct);
   }

   // reset editting product when modal create product close
   useEffect(() => {
      if (!isShowModalCreatelProduct) {
         setProductEditing(null);
      }
   }, [isShowModalCreatelProduct]);

   // update productlist when add new or edit product
   useEffect(() => {
      if (productListState) {
         const sortProductListState = sortDataByUpdatedTime(productListState);
         setRenderProductList(sortProductListState);
      }
   }, [productListState]);

   // update list product

   return (
      <AdminLayout>
         {/* Product */}
         <div>
            <div className='flex gap-10 items-center'>
               <AdminButton click={() => setIsShowModalCreateProduct(true)}>
                  <AiOutlinePlusCircle /> Create new product
               </AdminButton>
            </div>
            <div className='mt-5 flex items-center gap-10'>
               <p className='text-2xl font-semibold'>Product list</p>

               {/* tìm kiếm sản phẩm */}
               <input
                  placeholder='Tìm kiếm sản phẩm...'
                  className='border-2 rounded-lg p-1 min-w-[300px]'
               />
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-10 mt-5'>
               {renderProductList.length > 0 &&
                  renderProductList.map((product, index) => (
                     <div
                        key={index}
                        className='flex justify-between flex-col border-[2px] border-gray-800 rounded-md p-1'>
                        <ProductItem
                           renderProductList={renderProductList}
                           product={product}
                           handleClickEditProduct={handleClickEditProduct}></ProductItem>
                     </div>
                  ))}
            </div>
         </div>

         {/* modal create normal product */}
         {isShowModalCreatelProduct && (
            <AdminModal
               title={`${productEditing ? 'Edit product' : 'Create new product'}`}
               showFooter={false}
               className='w-[800px] pb-2'
               cancel={() => setIsShowModalCreateProduct(false)}>
               <ModalCreateProduct
                  cancel={() => setIsShowModalCreateProduct(false)}
                  createUpdateProduct={createUpdateProduct}
                  categoryList={categoryList}
                  productEditing={productEditing}
               />
            </AdminModal>
         )}

         {isShowLoading && <LoadingActionPage />}
      </AdminLayout>
   );
}

export const getServerSideProps = async () => {
   //   panelList for story
   let productList, categoryList, productOrigin;

   try {
      const productRes = await productApi.getAllProductByName();
      const categoryRes = await categoryApi.getAllCategory();

      const categoryData = categoryRes?.data?.data;
      const productListByName = productRes?.data?.data;
      productOrigin = productListByName;
      // get category for product (#category for promo)
      categoryList = categoryData
         .filter(
            (cate) =>
               cate.status == true &&
               (cate?.description?.indexOf('-category-for-promo') < 0 || !cate?.description)
         )
         .map((category) => ({
            name: category.name,
            id: category._id,
         }));

      productList = filterProductActive(productListByName);

      // promoList = categoryList.filter((item) => item);
   } catch (error) {}

   return {
      props: {
         productList: productList || [],
         categoryList: categoryList || [],
         productOrigin: productOrigin || [],
      },
   };
};
