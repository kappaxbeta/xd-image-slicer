import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import {Point} from "framer-motion";
import {TouchEvent} from "react";

function getDistance(p1 : Point, p2 : Point) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenter(p1: Point, p2: Point) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    };
}
var lastCenter : Point | null = null;
var lastDist = 0;
var dragStopped = false;


export function onPointerMove(evt: KonvaEventObject<PointerEvent>) {
    console.log(evt.evt.pointerType)
    alert(evt.evt.pointerType + " " + evt.evt.pointerId )
}
export function onMoveStart(evt: KonvaEventObject<TouchEvent<Element>>, setZoom : React.Dispatch<React.SetStateAction<number>>) {

    let e = evt;
    let stage = e.currentTarget;
   // e.evt.preventDefault();
    let touch1 = e.evt.touches[0];
    let touch2 = e.evt.touches[1];

    // we need to restore dragging, if it was cancelled by multi-touch
    if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
        stage.startDrag();
        dragStopped = false;

    }

    if (touch1 && touch2) {

        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
        if (stage.isDragging()) {
            dragStopped = true;
            stage.stopDrag();

        }

        let p1 = {
            x: touch1.clientX,
            y: touch1.clientY,
        };
        let p2 = {
            x: touch2.clientX,
            y: touch2.clientY,
        };

        if (!lastCenter) {

            lastCenter = getCenter(p1, p2);

            return;
        }
        let newCenter = getCenter(p1, p2);

        let dist = getDistance(p1, p2);

        if (!lastDist) {

            lastDist = dist;
        }

        // local coordinates of center point
        let pointTo = {
            x: (newCenter.x - stage.x()) / stage.scaleX(),
            y: (newCenter.y - stage.y()) / stage.scaleX(),
        };

        let scale = stage.scaleX() * (dist / lastDist);


        if(scale > 2.99 || scale < 0.02) {
            return;
        }
       setZoom(scale)

        stage.scaleX(scale);
        stage.scaleY(scale);

        // calculate new position of the stage
        let dx = newCenter.x - lastCenter.x;
        let dy = newCenter.y - lastCenter.y;

        let newPos = {
            x: newCenter.x - pointTo.x * scale + dx,
            y: newCenter.y - pointTo.y * scale + dy,
        };

        console.log("newpos", newPos)
        stage.position(newPos);

        lastDist = dist;
        lastCenter = newCenter;
    }
}

export function onMoveEnd() {
    lastDist = 0;
    lastCenter = null;
}

export const onScroll = (e : KonvaEventObject<WheelEvent>,  setZoom : React.Dispatch<React.SetStateAction<number>>) => {

    // stop default scrolling
    e.evt.preventDefault();
    var stage = e.currentTarget as Konva.Stage;
    var oldScale = stage.scaleX();
    var pointer = stage.getPointerPosition();
    var scaleBy = 1.01;

    if(!pointer) return

    var mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
        direction = -direction;
    }

    var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    console.log(newScale)
    if( newScale > 2.9 || newScale < 0.02) {
        return
    }
    stage.scale({ x: newScale, y: newScale });
    setZoom(newScale)

    var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
}





