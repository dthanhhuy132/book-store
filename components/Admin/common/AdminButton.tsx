interface IButton {
   children?: any;
   className?: string;
   click: (e: any) => void;
   type?: string;
}

export default function AdminButton({
   children = '',
   className = '',
   click = () => {},
   type = 'edit',
}: IButton) {
   return (
      <button
         onClick={click}
         className={` flex items-center gap-1  text-white px-2 py-2 border-1px rounded-lg ${className} ${
            type === 'edit' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-red-800 hover:bg-red-700'
         }`}>
         {children}
      </button>
   );
}
