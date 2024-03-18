
import { IDateRange, dateRangeOverlapsAnother, format_date } from '../utils/date'

import { v4 as uuidv4 } from 'uuid'

interface ISchedulerEvent extends IDateRange
{
    id?: any,
    label: string;
    color?: string,
    bgColor?: string
}

interface IEventOffset {
    current: number;
    length:  number;
}

class SchedulerEvent {

    public id: number|string;

    public label: string;
 
    public start: Date;

    public end: Date;

    public color: string;

    public bgColor: string;

    constructor( values: any, options: any  = {} ) {

        this.id      = values.id || uuidv4();
        this.label   = values.label;
        this.start   = new Date(values.start);
        this.end     = new Date(values.end);
        this.color   = values.color   || options.defaultEventColor;
        this.bgColor = values.bgColor || options.defaultEventBgColor;

        if (isNaN(this.end.getTime())) {
            this.end.setTime(this.start.getTime() + 60 * 60 * 1000)
        }

    }

    equals(subject: ISchedulerEvent): boolean {
        return this.id === subject.id;
    }

    getStartAsString(format: string): string {
        return format_date(format, this.start);
    }

    getEndAsString(format: string): string {
        return format_date(format, this.end);
    }

    getData(): Dictionary {
        return {
            id:      this.id,
            label:   this.label,
            start:   this.getStartAsString('yyyy-mm-dd hh:ii'),
            end:     this.getEndAsString('yyyy-mm-dd hh:ii'),
            bgColor: this.bgColor
        };
    }
}

function calcEventsOffsets(events: ISchedulerEvent[]): Map<ISchedulerEvent, IEventOffset>
{
    const eventsPositions = new Map();

    const intersections: any = events.map((event, index) => {

        const otherEvents = events.filter(v => dateRangeOverlapsAnother(event, v));
        
        const length = otherEvents.length + 1;

        const allPositions = Array.from({length}, (_, k) => k);
        const otherPositions = otherEvents.map(v => eventsPositions.get(v))
            .filter(v => v !== undefined);
        
        const positions = allPositions.filter(v => !otherPositions.includes(v));
        eventsPositions.set(event, Math.min(...positions));

        return [event, otherEvents];
    })

    const results = new Map();
    for (const [event, otherEvents] of intersections) {

        const current = eventsPositions.get(event)!;
        const otherPositions = otherEvents.map((v: any) => eventsPositions.get(v));
        const length   = Math.max(current, ...otherPositions) + 1;

        results.set(event, {current, length});
    }

    return results;
}

// @todo missing test
function createSchedulerEvent(values: any, options: any = {}): ISchedulerEvent {

    if (values instanceof SchedulerEvent) {
        return values;
    }

    return new SchedulerEvent(values, options);

}

export { createSchedulerEvent, SchedulerEvent }
export { calcEventsOffsets }

