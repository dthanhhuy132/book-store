// const tabName = ['Product Banner', 'Product story', 'Product'];
const tabName = ['Story', 'Product'];

export default function ProductTab({tabActive, setTabActive}: any) {
   return (
      <div className='text-lg text-center text-gray-900 border-b font-extrabold border-gray-500 '>
         <ul className='flex flex-wrap -mb-px'>
            {tabName.map((tab) => (
               <li
                  key={tab}
                  className={`mr-2 inline-block p-4 rounded-t-lg border-b-2 border-transparent cursor-pointer ${
                     tabActive === tab &&
                     'text-blue-600 rounded-t-lg border-b-2 border-blue-600 active'
                  }`}
                  onClick={() => setTabActive(tab)}>
                  {tab}
               </li>
            ))}
         </ul>
         {/* Product Product story */}
      </div>
   );
}
