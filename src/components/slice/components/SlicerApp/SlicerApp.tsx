import {Stage, Layer, Transformer, Rect} from "react-konva";
import ImageLayer from "./ImageLayer";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {nanoid} from "nanoid";
import Konva from "konva";
import {SlicerIcons} from "@/components/icons/SlicerIcons.tsx";
import {onMoveEnd, onMoveStart,  onScroll} from "./canvasEvent.ts";



// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function downloadURI(uri, name) {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
 // delete link;
}

interface SlicerAppProps  {
  image: string;
  height: number;
  width : number;
  reset: () => void;
}
export default function SlicerApp({ image, width, height, reset}: SlicerAppProps) {
  const [loadSize, setLoadSize] = useState(false);
  const [sizes, setSizes]   = useState({width: 0, height: 0});
  const [crops, setCrops] = useState<{x: number,y:number, width: number, height:number, id: string, scaleY:number, scaleX: number}[]>([])
  const [active, setActive] = useState<string | null>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const stageRef= useRef<Konva.Stage | null>(null);
  const [zoom, setZoom] = useState(1.0)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  useEffect(() => {
    const img = new Image();
    img.onload = function() {
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
      setSizes({width: this.width, height: this.height});
      setLoadSize(true);
    }
    img.src = image;


  }, []);


  useEffect(() => {
    if(!active) {
      transformerRef.current?.nodes([]);
    }

    if(active) {
      console.log(active)
      const node = stageRef.current?.findOne("#" + active)
      if(node ){
      transformerRef.current?.nodes([node]);
      }
    }
    transformerRef.current?.getLayer()?.batchDraw();
  }, [active]);


  return <div className={"flex w-full py-3 flex-col "}>
    <div className={" grid grid-cols-3 md:grid-cols-5 gap-5 w-full py-3 "}>
      <Button variant={"outline"} className={"rounded"} onClick={() => {
        const id = nanoid()
        setCrops((crops) => {
          return [...crops, {x: 0, y: 0, width: 100, height: 100, id, scaleX: 0, scaleY: 0}]
        })

      }}>
        <SlicerIcons.Crop></SlicerIcons.Crop> <span className={"px-1"}>Add Crop</span>
      </Button>
      <Button variant={"outline"} className={"rounded"} onClick={() => {
        if (!active) return;
        const conf = crops.find(i => {
          return i.id === active
        });
        const imageSrc = new Image()
        imageSrc.onload = () => {
          if (!conf) return
          const newImage = new Konva.Image({
            image: imageSrc,
            width: conf?.width * conf?.scaleX,
            height: conf?.height * conf?.scaleY,
            crop: {
              x: conf.x,
              y: conf.y,
              width: conf?.width * conf?.scaleX,
              height: conf?.height * conf?.scaleY,
            }
          });

          const dataURL = newImage.toDataURL({
            pixelRatio: 1
          })
          downloadURI(dataURL, 'crop.png');

        }
        imageSrc.src = image

      }}>
        <SlicerIcons.Download></SlicerIcons.Download> <span className={"px-1"}>Download</span>
      </Button>
      <div className={"flex align-middle"}>
        <Button variant={"destructive"} className={"w-1/3"} disabled={zoom < 0.02} onClick={() => {
          setZoom(zoom => zoom - 0.05)
          stageRef.current?.scale({x: zoom, y: zoom})
        }}>
          <SlicerIcons.ZoomOut className="md:flex sm:hidden"></SlicerIcons.ZoomOut> <span className={"md:sr-only"}>-</span>
        </Button>
        <code className={"w-1/3 flex items-center justify-center "}>
          {Math.ceil(zoom * 100)}%
        </code>
        <Button className={"w-1/3"} variant={"destructive"} disabled={zoom > 2.99} onClick={() => {
          setZoom(zoom => zoom + 0.05)
          stageRef.current?.scale({x: zoom, y: zoom})
        }}>
          <SlicerIcons.ZoomIn className="md:flex sm:hidden"></SlicerIcons.ZoomIn> <span className={"md:sr-only"}>+</span>
        </Button>
      </div>
      <Button variant={"destructive"} onClick={() => reset()}>
        <SlicerIcons.Delete className="h-4 w-4 fill-current"></SlicerIcons.Delete> <span className={"px-1"}>Delete</span>
      </Button>

    </div>
    {/* @ts-ignore */}
    {loadSize ? <Stage onTouchStart={() => {}} onTouchMove={(evt) => {
      // @ts-ignore
      onMoveStart(evt, setZoom)
    }}
                       className={"border border-accent"}
                       onTouchEnd={onMoveEnd}
                       onWheel={(evt ) => {
                         onScroll(evt, setZoom)
                       }}
                       draggable={true}
                       width={width}
                       height={height}
                       onTransform={(transform) => {
                         console.log(transform)
                       }}
                       ref={(ref) => {
                         stageRef.current = ref
                       }}>
      <Layer draggable={true}>
        <ImageLayer id="mainImage" draggable={false} x={0} y={0} width={sizes.width} height={sizes.height}
                        onClick={() => {
                          setActive(null)
                        }} src={image}/>


            {crops && crops.map((crop) => {
              return <Rect key={crop.id + "-rect"} id={crop.id} y={crop.y} x={crop.x} height={crop.height}
                           width={crop.width} stroke={"blue"} draggable={true} onClick={() => {
                setActive(crop.id)
              }} onPointerClick={() => {
                setActive(crop.id)
              }}></Rect>
            })}

            <Transformer onTransformEnd={(e) => {
              console.log(e)

              if (stageRef.current) {

                const Image = stageRef.current.findOne("#mainImage")
                const attr = e.target.attrs
                console.log(Image)
                setCrops(c => {
                  return c.map(crop => {
                    if (active === crop.id) {
                      return {
                        ...crop,
                        x: attr.x,
                        y: attr.y,
                        scaleX: attr.scaleX,
                        scaleY: attr.scaleY
                      }
                    }
                    return crop
                  })
                })
              }

            }} ref={transformerRef} rotateEnabled={false}></Transformer>

          </Layer>

        </Stage> : "Load Size" }

    </div>;
}
