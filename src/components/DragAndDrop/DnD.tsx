import {useDropzone} from 'react-dropzone';
import {FC, ReactElement, useCallback} from "react";


const DnD : FC<{children : ReactElement, onImageLoad?: (image: string) => void, onClickOpen : boolean}> = ({children, onImageLoad}) => {
    const onDrop = useCallback((acceptedFiles: unknown[]) => {
        // Do something with the files
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              if(onImageLoad) {
                onImageLoad(reader.result as string)
              }
            };
            reader.readAsDataURL(file as Blob);

        }
    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})


    return <div  {...getRootProps() }   className={"relative h-full w-full"}>
        <input {...getInputProps()} />
        {children}
    </div>
}
export default DnD;
