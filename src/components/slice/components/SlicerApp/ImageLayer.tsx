import { Image } from "react-konva";
import useImage from "use-image";


function ImageLayer (props : { x: number, y: number, width: number, height: number, onClick: (e : string) => void, src: string, id: string, draggable: boolean })   {
    const {x, y, width, height, onClick, src, id} = props;
    const [image] = useImage(src)
    return (
            <Image
                id={props.id}
                draggable={props.draggable}
                onPointerClick={() => {
                    console.log(id);
                    onClick(id)
                }}
                onClick={() => {
                    console.log(id);
                    onClick(id)
                }}
                name="Test"
                image={image}
                x={x}
                y={y}
                width={width}
                height={height}

            />

    );
}

export default ImageLayer;
