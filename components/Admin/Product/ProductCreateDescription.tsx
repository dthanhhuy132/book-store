import {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';
import {RiContactsBookLine} from 'react-icons/ri';

const SunEditor = dynamic(() => import('suneditor-react'), {
   ssr: false,
});

export default function ProductCreateDescription({value = '', onChange = () => {}}: any) {
   const [editorContent, setEditorContent] = useState(value);

   useEffect(() => {
      onChange(editorContent);
   }, [editorContent]);

   return (
      <div>
         <SunEditor
            placeholder='Product description...'
            setDefaultStyle={`font-family: "Gilroy; font-weight: 700"`}
            setOptions={{
               buttonList: [['image']],
               imageAccept: 'jpg, jpeg, png, webp',
            }}
            // onImageUploadBefore={(file) => handleImageUploadBefore(file)}
            setContents={editorContent}
            onChange={(inputContent: string) => {
               setEditorContent(inputContent);
               onChange(inputContent);
            }}
         />
      </div>
   );
}
