"use client"

import {useState} from "react";
import DropContainer from "./components/DropContainer/DropContainer.tsx";
import SlicerApp from "./components/SlicerApp/SlicerApp";
import { useElementSize } from 'usehooks-ts'
export default function Slice () {
  const [dropped , setDropped] = useState<string | null>(null);
  const [squareRef, { width, height }] = useElementSize()
  return <div className={"h-[calc(100vh-100px)] overflow-hidden"}>
    <h1 className={"text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl"}>Slice image</h1>
    <div className={"flex-1 squar h-full"} ref={squareRef}>
      {dropped ?  <SlicerApp reset={() => setDropped(null)} image={dropped}  width={width } height={height - 100} /> : <DropContainer setDropped={setDropped}/> }
    </div>

  </div>
}
