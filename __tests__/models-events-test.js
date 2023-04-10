/**
 * @jest-environment jsdom
 */

import { buildEventsManager, overlaps, calcEventsOffsets } from '../src/models/events';

// import { ISchedulerEvent, IEventOffset } from '../src/types'

const defaultEvent = {
    label: "meeting"
}

describe("Events functions", () => {

    test("is overlapping ?", () => {

        const events = [
            {
                ...defaultEvent,
                start: new Date("2020-01-01 10:20"),
                end:   new Date("2020-01-01 10:30"),
            },
            {
                ...defaultEvent,
                start: new Date("2020-01-02 11:20"),
                end:   new Date("2020-01-02 11:30"),
            },
            {
                ...defaultEvent,
                start: new Date("2020-01-02 10:20"),
                end:   new Date("2020-01-02 12:00"),
            },
        ]

        expect(overlaps(events[0], events[0])).toBe(false);

        expect(overlaps(events[0], events[1])).toBe(false);

        expect(overlaps(events[1], events[2])).toBe(true);

    });

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


describe("buildEventsManager()", () => {
    
    describe("with 'memory' type", () => {

        test("loading events", () => {

            const events = [
                {
                    ...defaultEvent,
                    start: new Date("2020-01-01 10:20"),
                    end:   new Date("2020-01-01 10:30"),
                },
                {
                    ...defaultEvent,
                    start: new Date("2020-01-02 11:20"),
                    end:   new Date("2020-01-02 11:30"),
                }
            ]

            const manager = new buildEventsManager({ type: 'memory', events});

            expect(manager.load()).toStrictEqual(events);

        });

        test("reloading events without saving an updated event", () => {

            const manager = buildEventsManager({
                type: 'memory',
                events: [
                    {
                        ...defaultEvent,
                        start: new Date("2020-01-01 10:20"),
                        end:   new Date("2020-01-01 10:30"),
                    }
                ]
            })

            let events = manager.load();

            events[0].end = new Date("2020-01-01 20:00");

            expect(manager.load()).toStrictEqual([{
                ...defaultEvent,
                start: new Date("2020-01-01 10:20"),
                end:   new Date("2020-01-01 10:30"),
            }]);

        });

        test("saving events", () => {

            const manager = buildEventsManager({
                type: 'memory',
                events: [
                    {
                        ...defaultEvent,
                        start: new Date("2020-01-01 10:20"),
                        end:   new Date("2020-01-01 10:30"),
                    }
                ]
            });

            const events = manager.load();

            events[0].end = new Date("2020-01-01 20:00");

            manager.save(events[0]);

            expect(manager.load()).toStrictEqual([{
                ...defaultEvent,
                start: new Date("2020-01-01 10:20"),
                end:   new Date("2020-01-01 20:00"),
            }]);

        });

    });


    test("with 'hidden_input' type", () => {

        document.body.innerHTML = `
            <form>
                <input 
                    id    = "json"
                    type  = "hidden" 
                    value = '[{"label":"foo"}, {"label":"bar"}]'
                />
                <input
                    id    = "empty"
                    type  = "hidden"
                    value = ""
                />
            </form>
        `;
        
        const elements = {}, managers = {}
        for (const id of ['json', 'empty']) {
            elements[id] = document.getElementById(id);
            
            managers[id] = buildEventsManager({
                type:    'hidden_input', 
                element:  elements[id]
            });
        }
        
        expect(managers['json'].load()).toStrictEqual([
            {id: '1', label: 'foo'},
            {id: '2', label: 'bar'}
        ]);
        
        managers['json'].save({id: 1, label: 'baz'});
        
        expect(JSON.parse(elements['json'].value)).toStrictEqual([
            {label: 'baz'},
            {label: 'bar'}
        ]);
        
        managers['json'].save({id: 'new_1', label: 'foo'});
        
        expect(JSON.parse(elements['json'].value)).toStrictEqual([
            {label: 'baz'},
            {label: 'bar'},
            {label: 'foo'},
        ]);
        
        managers['json'].save({id: 'new_1', label: 'foo2'});
        
        expect(JSON.parse(elements['json'].value)).toStrictEqual([
            {label: 'baz'},
            {label: 'bar'},
            {label: 'foo2'},
        ]);
        
        managers['json'].delete({id: 1});
        
        expect(JSON.parse(elements['json'].value)).toStrictEqual([
            {label: 'bar'},
            {label: 'foo2'},
        ]);
        
        managers['json'].save({
            label: 'foo',
            start: new Date("2024-01-20 10:00"),
            end: new Date("2024-01-20 12:00")
        });
        
        expect(JSON.parse(elements['json'].value)).toStrictEqual([
            { label: 'bar' },
            { label: 'foo2' },
            { label: 'foo', start: "2024-01-20 10:00", end: "2024-01-20 12:00"}
        ]);
        
        // should not trigger any error
        managers['json'].save({
            id: 'new_2',
            label: 'foo3',
            start: new Date("2024-01-20 10:00"),
            end: new Date("2024-01-20 12:00")
        });
        
        expect(managers['empty'].load()).toStrictEqual([]);
        
    });
    
});