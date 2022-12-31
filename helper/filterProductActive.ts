export default function filterProductActive(productListByName: any) {
   const activeProduct = productListByName
      ?.map((product) => {
         const productItem = product?.data;
         return {
            name: product?.name?.name,
            data: productItem?.filter((item) => item.status !== false),
         };
      })
      ?.filter((product) => product?.data?.length > 0)
      ?.map((product, index) => {
         const sizeQuantity = {};
         const sizeID = {};
         product.data.forEach((item) => {
            sizeQuantity[item.size] = item.quantity;
            sizeID[item.size] = item._id;
         });

         return {
            name: product.name,
            size: sizeQuantity,
            sizeID: sizeID,
            productID: product.data.map((item) => item._id),
            pictures: product.data[0].pictures,
            price: product.data[0].price,
            description: product.data[0].description,
            colorList: product.data[0].colorList,
            productType: product.data[0]?.productType || null,
            categoryId: product.data[0]?.idCategory || null,
            status: product.data[0]?.status || null,
            updatedAt: product.data[0].updatedAt,
         };
      });

   return activeProduct;
}
