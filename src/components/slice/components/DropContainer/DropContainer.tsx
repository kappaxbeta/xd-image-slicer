import DnD from "@/components/DragAndDrop/DnD.tsx";
import {Dispatch, SetStateAction} from "react";

export default function DropContainer ({setDropped } : {setDropped :  Dispatch<SetStateAction<string | null>>}) {
  return <div className={"flex w-full py-3 flex-1"}>
    <DnD onImageLoad={(image) => {
      setDropped(image)
    }} onClickOpen={true}>
      <div className={"border-dashed border-2 flex align-middle items-center justify-between flex-col"}
           style={{width: "calc(100% - 1rem)", height: 300}}>
        <span className={"flex flex-grow align-middle items-center"}>Click or drop Image</span>
      </div>
    </DnD>
  </div>
}
