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
import {getProductByNameAsync} from '../../store/product/productAsynAction';
import {toast} from 'react-toastify';
import AdminProductStory from '../../components/Admin/Product/AdminProductStory';
import panelApi from '../../service/panelApi';
import {PANEL_FOR_STORY} from '../../store/panel/panelSlice';
import sortDataByUpdatedTime from '../../components/Admin/common/sortDataByUpdatedTime';

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
         colorList,
         productAvatar,
         productPictures,
         sizeQuantity,
         productId,
         changeImageUpload,
         sizeProductWithID,
      } = product;

      const checkSize = Object.values(sizeQuantity).filter((item) => Number(item) >= 0);
      if (
         checkSize.some((item) => Number(item) < 0) ||
         checkSize.length == 0 ||
         checkSize.every((item) => Number(item) == 0)
      ) {
         toast.error('Số lượng từng size chưa hợp lệ! Phải có ít nhất size có số lượng > 0!');
         return;
      }

      // Chỉnh sửa sản phẩm đang được phát triển
      if (productId) {
         console.log('productId la gi', productId);
         console.log('sizeProductWithID la gi', sizeProductWithID);
         const sizeQuantityMap = Object.keys(sizeQuantity).map((item) => ({
            size: item,
            quantity: sizeQuantity[item],
            productId: sizeProductWithID[item],
         }));

         // console.log('sizeQuantity la gi', sizeQuantity);
         // console.log('sizeQuantityMap la gi', sizeQuantityMap);
         // Chỉnh sửa lại: id sản phẩm, số lượng, size
         // new khoong cos size -> tajo moiw sanr phama

         // chỉnh sửa sản phẩm
         if (changeImageUpload == true) {
            setIsShowLoading(true);

            // thay đổi hình sảnh sản phẩm
            Promise.all(
               sizeQuantityMap.map((item) => {
                  const formData = new FormData();
                  formData.append('name', name);
                  formData.append('idCategory', categoryId);
                  formData.append('description', description);
                  formData.append('pictures', productAvatar);
                  formData.append('price', price);
                  if (colorList.length == 1) {
                     formData.append('colorList[0]', colorList[0]);
                  }
                  if (colorList.length > 1) {
                     colorList.forEach((color) => formData.append('colorList', color));
                  }
                  productPictures.forEach((pic) => formData.append('pictures', pic));
                  formData.append('size', item.size);
                  formData.append('quantity', item.quantity);
                  const id = item.productId;
                  return productApi.updateProduct(accessToken, id, formData).then((res) => {
                     return res.status;
                  });
               })
            ).then((res) => {
               if (res.some((item: any) => item >= 400)) {
                  toast.error(
                     'có lỗi xảy ra, vui lòng kiểm tra lại tên sản phẩm, hoặc kết nối mạng'
                  );
                  setIsShowLoading(false);
               } else {
                  dispatch(getProductByNameAsync()).then((res) => {
                     if (res.payload.ok) {
                        setIsShowModalCreateProduct(false);
                        setIsShowLoading(false);
                        toast.success('Cập nhật sản phẩm thành công');
                     } else {
                        toast.warning('Vui lòng tải lại trang để cập nhật sản phẩm');
                        setIsShowLoading(false);
                     }
                  });
               }
            });
         }

         if (changeImageUpload == false) {
            setIsShowLoading(true);
            // không thay đổi hình ảnh sản phẩm
            Promise.all(
               sizeQuantityMap.map((item) => {
                  const id = item.productId;
                  const formData = {
                     name,
                     description,
                     price,
                     categoryId,
                     colorList,
                     size: item.size,
                     quantity: item.quantity,
                  };
                  return productApi.updateProduct(accessToken, id, formData).then((res) => {
                     return res.status;
                  });
               })
            ).then((res) => {
               if (res.some((item: any) => item >= 400)) {
                  toast.error(
                     'có lỗi xảy ra, vui lòng kiểm tra lại tên sản phẩm, hoặc kết nối mạng'
                  );
                  setIsShowLoading(false);
               } else {
                  dispatch(getProductByNameAsync()).then((res) => {
                     if (res.payload.ok) {
                        setIsShowModalCreateProduct(false);
                        setIsShowLoading(false);
                        toast.success('Cập nhật sản phẩm thành công');
                     } else {
                        toast.warning('Vui lòng tải lại trang để cập nhật sản phẩm');
                        setIsShowLoading(false);
                     }
                  });
               }
            });
         }
      }
      // ------------------------------------------------> TẠO MỚI SẢN PHẨM
      if (!productId) {
         setIsShowLoading(true);
         console.log('tạo mới sản phẩm', productId);
         // tạo sản phẩm mới
         const sizeQuantityMap = Object.keys(sizeQuantity).map((item) => ({
            size: item,
            quantity: sizeQuantity[item],
         }));
         if (checkSize.length > 0 && checkSize.every((item) => Number(item) >= 0)) {
            setIsShowLoading(true);
            Promise.all(
               sizeQuantityMap.map((item) => {
                  const formData = new FormData();
                  formData.append('name', name);
                  formData.append('idCategory', categoryId);
                  formData.append('description', description);
                  formData.append('pictures', productAvatar);
                  formData.append('price', price);
                  if (colorList.length == 1) {
                     formData.append('colorList[0]', colorList[0]);
                  }
                  if (colorList.length > 1) {
                     colorList.forEach((color) => formData.append('colorList', color));
                  }
                  productPictures.forEach((pic) => formData.append('pictures', pic));
                  formData.append('size', item.size);
                  formData.append('quantity', item.quantity);
                  return productApi.createNewProduct(accessToken, formData).then((res) => {
                     return res.status;
                  });
               })
            ).then((res) => {
               if (res.some((item: any) => item >= 400)) {
                  toast.error(
                     'có lỗi xảy ra, vui lòng kiểm tra lại tên sản phẩm, hoặc kết nối mạng'
                  );
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
   }

   function handleClickEditProduct(editProduct) {
      console.log('editProduct', editProduct);
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
