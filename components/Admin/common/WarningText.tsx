interface ILoginValidtionText {
   warningText: string | any;
   isError?: boolean;
}

export default function WarningText({warningText, isError = false}: ILoginValidtionText) {
   return (
      <p className={`text-red-700 ${isError ? 'text-[1rem] italic' : 'text-[0.8rem]'} font-thin`}>
         * {warningText}
      </p>
   );
}
