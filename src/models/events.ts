
import { IDateRange, dateRangeOverlapsAnother } from '../utils/date'

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
function cleanEvent(rawSchedulerEvent: any): ISchedulerEvent {

    let { start, end, ...otherValues } = rawSchedulerEvent

    if (!end) {
        end = new Date(start)
        end.setTime(end.getTime() + 60 * 60 * 1000)
    }

    return {
        start: new Date(start),
        end:   new Date(end),
        ...otherValues
    }
}

export { cleanEvent, calcEventsOffsets }
