
import { ISchedulerEvent, IEventOffset } from '../types'

interface IEventsManager {
    
    load(): ISchedulerEvent[],
    save(item: ISchedulerEvent): void,

}

function overlaps(event: ISchedulerEvent, otherEvent: ISchedulerEvent): boolean
{
    if (event === otherEvent) return false;

    if ( !(otherEvent.end.getTime() - 1 < event.start.getTime() || event.end.getTime() - 1 < otherEvent.start.getTime()) ) {
        return true;
    }

    return false;
}

function calcEventsOffsets(events: ISchedulerEvent[]): Map<ISchedulerEvent, IEventOffset>
{
    const eventsPositions = new Map();

    const intersections: any = events.map((event, index) => {

        const otherEvents = events.filter(v => overlaps(event, v));
        
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

class MemoryEventsManager implements IEventsManager {

    protected _pendingEvents: ISchedulerEvent[] = [];
    protected _savedEvents:   ISchedulerEvent[];

    constructor(events: ISchedulerEvent[]) {
        this._savedEvents = events;
    }

    load(): ISchedulerEvent[] {
        this._pendingEvents = [...this._savedEvents].map(i => ({...i}));
        return this._pendingEvents;
    }

    save(event: ISchedulerEvent) {
        const index = this._pendingEvents.indexOf(event);
        if (index >= 0) {
            this._savedEvents[index] = event;
        }
    }

}

class HiddenInputEventsManager implements IEventsManager {

    protected _element: HTMLInputElement;
    protected _indexedItems: any = {};

    constructor(element: HTMLInputElement) {

        this._element = element;
        const rows  = JSON.parse(this._element.value || '[]');

        let id = 1;
        for (const row of rows) {
            this._indexedItems[id++] = row;
        }

    }

    load(): ISchedulerEvent[] {

        return Object.keys(this._indexedItems).map(id => {
            return { id, ...this._indexedItems[id] }
        });

    }

    save(item: ISchedulerEvent) {

        const {id, ...otherValues} = item;

        this._indexedItems[id] = otherValues;

        const values: any = Object.values(this._indexedItems).map((v: any) => {
            for (const k of ['start', 'end'].filter(k => k in v)) {
                v[k] = this.cleanDate(v[k]);
            }
            return v;
        });

        this._element.value = JSON.stringify(values);

    }

    delete(item: ISchedulerEvent) {
        delete this._indexedItems[item.id];

        this._element.value = JSON.stringify(Object.values(this._indexedItems));  
    }

    protected cleanDate(date: any) {
        const d = new Date(date);

        return [
            d.getFullYear(),
            ('0' + (d.getMonth() + 1)).slice(-2),
            ('0' + d.getDate()).slice(-2)
        ].join('-') + ' ' + [
            ('0' + d.getHours()).slice(-2),
            ('0' + d.getMinutes()).slice(-2)
        ].join(':')
    }

}

function buildEventsManager({type, ...options}: any) {

    switch (type) {
        case 'memory':
            return new MemoryEventsManager(options.events);
        case 'hidden_input':
            return new HiddenInputEventsManager(options.element);
    }

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


export { buildEventsManager, cleanEvent }
export { overlaps, calcEventsOffsets }