/**
 * @jest-environment jsdom
 */

import { overlaps, calcEventsOffsets } from '../src/models/events';

// import { ISchedulerEvent, IEventOffset } from '../src/types'

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
