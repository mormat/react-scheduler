
interface IDateRange {
    start: Date;
    end:   Date;
}

interface ICoordinate {
    clientX: number
    clientY: number,
}

interface ISchedulerEvent extends IDateRange
{
    id?: any,
    label: string;
    color?: string,
    bgColor?: string
}

interface ISchedulerConfig {

    firstHour: number;

    lastHour: number;

    initialDate: date|number|string;

    events: any[];

    viewMode: string;

}

interface ILayout<V = any> {

    element: Element

    getValueAtCoord(pos: ICoordinate): Nullable<V>

    children: ILayout<V>[]

}

interface IDragHandler<K>  {

    press(coord: Coordinate, subject: K, data: Dictionary<any>): void

    move(coord: Coordinate, subject: K, data: Dictionary<any>): void

    release(coord: Coordinate, subject: K, options: Dictionary<any>): void
}

interface IEventOffset {
    current: number;
    length:  number;
}

export { ISchedulerEvent, ISchedulerConfig, ILayout, IDragHandler, ICoordinate, IEventOffset, IDateRange }
