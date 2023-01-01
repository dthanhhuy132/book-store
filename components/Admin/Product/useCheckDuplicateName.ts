import {useDispatch} from 'react-redux';
import productApi from '../../../service/productApi';

export default async function useCheckDuplicateName(productnName) {
   const dispatch = useDispatch();

   const searchProductNameRes = await productApi.searchProduct(productnName);
   const searchProductNameData = searchProductNameRes?.data?.data;

   console.log('searchProductNameData', searchProductNameData);

   function checkProductDuplicateName() {}
}
