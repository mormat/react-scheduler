/**
 * @jest-environment jsdom
 */

import { SchedulerEvent } from '../src/models/events';


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
