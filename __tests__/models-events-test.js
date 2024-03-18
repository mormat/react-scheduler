/**
 * @jest-environment jsdom
 */

import { overlaps, calcEventsOffsets, SchedulerEvent } from '../src/models/events';


test("SchedulerEvent", () => {
   
    const event = new SchedulerEvent({
        'id'     : 1234,
        'label'  : 'Description',
        'start'  : new Date("2024-03-10 10:00:02"),
        'end'    : new Date("2024-03-10 12:00:03"),
        'bgColor': '#ff0000',
    });
    
    expect(event.getData()).toEqual({
        id: 1234,
        label: 'Description',
        start: '2024-03-10 10:00',
        end: '2024-03-10 12:00',
        bgColor: '#ff0000'
    });
    
});

const defaultEvent = {
    label: "meeting"
}

describe("Events functions", () => {

    // placement ? 0 out of 1
    test("calcEventsOffsets", () => {

        const events = [
            {
                start: new Date("2020-01-02 11:20"),
                end:   new Date("2020-01-02 11:30"),
                ...defaultEvent,
            },
            {
                start: new Date("2020-01-01 10:00"),
                end:   new Date("2020-01-01 10:25"),
                ...defaultEvent,
            },
            {
                start: new Date("2020-01-01 10:20"),
                end:   new Date("2020-01-01 16:00"),
                ...defaultEvent,
            },
            
            {
                start: new Date("2020-01-01 14:30"),
                end:   new Date("2020-01-01 15:30"),
                ...defaultEvent,
            },
        ]

        // @todo const results: Map<ISchedulerEvent, IEventOffset> = calcEventsOffsets(events);
        
        const results = calcEventsOffsets(events);
        
        expect(results.get(events[0])).toStrictEqual({current: 0, length: 1});
        expect(results.get(events[1])).toStrictEqual({current: 0, length: 2});
        expect(results.get(events[2])).toStrictEqual({current: 1, length: 2});
        expect(results.get(events[3])).toStrictEqual({current: 0, length: 2});
        
    });

});
