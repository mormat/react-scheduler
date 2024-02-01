
import { IRectangle } from '../utils/geom';

import { IDateRange } from '../utils/date'

import { Rectangle, calcDistance } from '../utils/geom';

interface IDraggableArea {

    getData(e: any): any

    getRect(): IRectangle;

}

interface IDraggable {

    drag(e: MouseEvent): void;

    move(e: MouseEvent): void;

    drop(e: MouseEvent): void;

}

abstract class Draggable implements IDraggable {

    drag(e: MouseEvent) {};

    move(e: MouseEvent) {};

    drop(e: MouseEvent) {};

    // @todo missing unit test
    startDragAndDrop(e: MouseEvent, renderer: any) {

        e.preventDefault();

        if (e.button !== 0) return;

        this.drag(e);
        renderer({e, action: 'drag', draggable: this});

        const onMouseMove = (e: MouseEvent) => {
            this.move(e);
            renderer({e, action: 'move', draggable: this});
        }
        const onMouseUp   = (e: MouseEvent) => {
            this.drop(e);
            renderer({e, action: 'drop', draggable: this});
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

}

class MoveEventDraggable extends Draggable {

    protected initialValue: any;
    protected currentValue: any = null;
    protected onChange: any;
    protected area: IDraggableArea;
    protected diff = 0;

    constructor(value: any, onChange: any, area: IDraggableArea)
    {
        super();
        this.initialValue = value;
        this.onChange     = onChange;
        this.area         = area;
    }

    getCurrentValue() {
        return this.currentValue;
    }

    getArea(): IDraggableArea {
        return this.area;
    }

    protected getCurrentTimestamp(e: MouseEvent) {

        const { percentY, day, minhour, maxhour } = this.area.getData(e);
        
        const constraint: IDateRange = {
            start: new Date(day + ' ' + minhour),
            end:   new Date(day + ' ' + maxhour),
        }

        const length = constraint.end.getTime() - constraint.start.getTime();

        return constraint.start.getTime() + (length * percentY / 100);

    }

    drag(e: MouseEvent) {
        this.currentValue = { ... this.initialValue };

        this.diff = this.currentValue.start.getTime() - this.getCurrentTimestamp(e);

    }

    move(e: MouseEvent) {

        const { percentY, day, minhour, maxhour } = this.area.getData(e);
        
        const constraint: IDateRange = {
            start: new Date(day + ' ' + minhour),
            end:   new Date(day + ' ' + maxhour),
        }

        let startTime = this.getCurrentTimestamp(e) + this.diff;
        
        startTime = startTime - (startTime % (15 * 60 * 1000))

        const valueLength = this.initialValue.end.getTime() - this.initialValue.start.getTime();

        if (startTime < constraint.start.getTime()) {
            startTime = constraint.start.getTime();
        }

        if (startTime + valueLength > constraint.end.getTime()) {
            startTime = constraint.end.getTime() - valueLength;
        }

        this.currentValue.start = new Date(startTime);
        this.currentValue.end = new Date(startTime + valueLength);

    }

    drop(e: MouseEvent) {
        
        this.onChange(this.currentValue, this.initialValue);

    }

}

class ResizeEventDraggable extends Draggable {

    protected initialValue: any;
    protected currentValue: any = null;
    protected onChange: any;
    protected area: IDraggableArea;

    constructor(value: any, onChange: any, area: IDraggableArea)
    {
        super();
        this.initialValue = value;
        this.onChange     = onChange;
        this.area         = area;
    }

    getCurrentValue()
    {
        return this.currentValue;
    }

    getArea(): IDraggableArea {
        return this.area;
    }

    protected getCurrentTimestamp(e: MouseEvent) {

        const { percentY, day, minhour, maxhour } = this.area.getData(e);
        
        const constraint: IDateRange = {
            start: new Date(day + ' ' + minhour),
            end:   new Date(day + ' ' + maxhour),
        }

        const length = constraint.end.getTime() - constraint.start.getTime();

        return constraint.start.getTime() + (length * percentY / 100);

    }

    drag(e: MouseEvent) {
        this.currentValue = { ... this.initialValue };
    }

    move(e: MouseEvent) {
        
        const { percentY, day, minhour, maxhour } = this.area.getData(e);
        
        const constraint: IDateRange = {
            start: new Date(day + ' ' + minhour),
            end:   new Date(day + ' ' + maxhour),
        }

        let endTime = this.getCurrentTimestamp(e);
        endTime = endTime - (endTime % (15 * 60 * 1000))

        if (endTime > constraint.end.getTime()) {
            endTime = constraint.end.getTime();
        }

        if (endTime < this.initialValue.start.getTime()) {
            endTime = this.initialValue.start.getTime() + 15 * 60 * 1000;
        }

        this.currentValue.end = new Date(endTime);

    }

    drop(e: MouseEvent) {
        
        this.onChange(this.currentValue, this.initialValue);

    }

}

// @todo rename this
// Draggable to move an event from a date to another date
class MonthlySheetDraggable extends Draggable {
    
    protected initialValue: any;
    protected currentValue: any;
    protected onChange: any;
    protected draggableArea: IDraggableArea;

    constructor(value: any, onChange: any, draggableArea: IDraggableArea)
    {
        super();
        this.initialValue = value;
        this.onChange = onChange;
        this.draggableArea = draggableArea;
    }

    getCurrentValue(): any {
        return this.currentValue;
    }

    getArea(): IDraggableArea {
        return this.draggableArea;
    }

    drag(e: MouseEvent) {
        this.currentValue = { ... this.initialValue };
    }

    move(e: MouseEvent) {
        
        const length = this.initialValue.end.getTime() - this.initialValue.start.getTime();

        const { day } = this.draggableArea.getData(e);

        const start = new Date(
            day + " " + 
            this.initialValue.start.getHours() + ':' +
            this.initialValue.start.getMinutes()
        );
        const end = new Date(start.getTime() + length);

        this.currentValue.start = start;
        this.currentValue.end   = end;
    }

    drop(e: MouseEvent) {
        const length = this.initialValue.end.getTime() - this.initialValue.start.getTime();

        const { day } = this.draggableArea.getData(e);

        const start = new Date(
            day + " " + 
            this.initialValue.start.getHours() + ':' +
            this.initialValue.start.getMinutes()
        );
        const end = new Date(start.getTime() + length);

        this.currentValue.start = start;
        this.currentValue.end   = end;

        this.onChange(this.currentValue, this.initialValue);
    }

}

class ElementDraggableArea implements IDraggableArea {
    
    protected selector;
    
    constructor(selector: string) {
        this.selector = selector;
    }
    
    getData(e: MouseEvent) {
        const element = this.getElement();
        const data: Dictionary<any> = { ...element.dataset };

        if (e) {
            const {x, y, width, height } = this.getRect();
            data['percentX'] = (e.pageX - x) * 100 / width ;
            data['percentY'] = (e.pageY - y) * 100 / height;
        }

        return data;
    }

    getRect() {
        const element = this.getElement();
        const { x, y, width, height } = element.getBoundingClientRect();
        
        return {
            x: x + window.scrollX, 
            y: y + window.scrollY,
            width, height
        };
    }

    getElement(): HTMLElement {
        return <HTMLElement> document.querySelector(this.selector);
    }

}

class CompositeDraggableArea implements IDraggableArea {

    protected children: IDraggableArea[]

    constructor(children: IDraggableArea[]) {
        this.children = children;
    }

    getChildren(): IDraggableArea[]
    {
        return this.children;
    }

    getData(e: MouseEvent) {
        const child = this.getClosestChild(e);
        return child ? child.getData(e) : {}
    }

    getRect() {
        const rects = [];
        for (let child of this.children) {
            rects.push(child.getRect());
        }
        return Rectangle.createBounding(rects);
        return new Rectangle({x: 0, y: 0, width: 0, height: 0});
    }

    getClosestChild(e: MouseEvent) {
        const point = {x: e.pageX, y: e.pageY}
        const childrenByDistance: any = {}

        const distances = [];
        for (let child of this.children) {
            const childRect = new Rectangle(<IRectangle> child.getRect());
            if (!childRect) continue;
            const distance = calcDistance(point, childRect.getCenter());
            distances.push(distance);

            childrenByDistance[distance] = child;
        }

        const lowest = Math.min(...distances);

        return childrenByDistance[lowest];
    }

}

export { ElementDraggableArea, CompositeDraggableArea }
export { MonthlySheetDraggable, MoveEventDraggable, ResizeEventDraggable }
export type { IDraggable, IDraggableArea }