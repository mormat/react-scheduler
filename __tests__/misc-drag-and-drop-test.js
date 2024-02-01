/**
 * @jest-environment jsdom
 */

import { ElementDraggableArea, CompositeDraggableArea } from '../src/misc/drag-and-drop';

import { MonthlySheetDraggable, MoveEventDraggable, ResizeEventDraggable } from '../src/misc/drag-and-drop';

import { IDraggableArea } from '../src/misc/drag-and-drop';

describe("Draggable", () => {
    
    test("MoveEventDraggable", () => {
        
        const immutableValue = Object.freeze({
            start: new Date("2020-01-01 10:00"),
            end:   new Date("2020-01-01 12:00"),
        })
        
        const onChange = jest.fn();
        
        const draggableArea = {
            getData: ({pageY}) => {
                return {
                    day: '2020-01-01',
                    minhour: '08:00',
                    maxhour: '20:00',
                    percentY: pageY,
                }
            },
            getRect: () => {},
        }
        
        const draggable = new MoveEventDraggable(
            immutableValue,
            onChange,
            draggableArea
        );

        // @todo draggable must be an instance of IDraggable

        expect(draggable.getArea()).toBe(draggableArea);

        draggable.drag({pageY: 2 * 100 / 12});
        expect(draggable.getCurrentValue()).toStrictEqual(immutableValue);

        draggable.move({pageY: 50});
        expect(draggable.getCurrentValue()).toEqual(
            expect.objectContaining({
                start: new Date("2020-01-01 14:00"),
                end:   new Date("2020-01-01 16:00"),
            })
        )

        draggable.move({pageY: 51});
        expect(draggable.getCurrentValue()).toEqual(
            expect.objectContaining({
                start: new Date("2020-01-01 14:00"),
                end:   new Date("2020-01-01 16:00"),
            })
        )

        draggable.move({pageY: -50});
        expect(draggable.getCurrentValue()).toEqual(
            expect.objectContaining({
                start: new Date("2020-01-01 08:00"),
                end:   new Date("2020-01-01 10:00"),
            })
        )

        draggable.move({pageY: 150});
        expect(draggable.getCurrentValue()).toEqual(
            expect.objectContaining({
                start: new Date("2020-01-01 18:00"),
                end:   new Date("2020-01-01 20:00"),
            })
        )

        draggable.drop({});
        expect(onChange).toHaveBeenNthCalledWith(
            1, 
            draggable.getCurrentValue(),
            immutableValue
        );
        
    })
    
    test("ResizeEventDraggable", () => {
        
        const immutableValue = Object.freeze({
            start: new Date("2020-01-01 10:00"),
            end:   new Date("2020-01-01 10:00"),
        })
        
        const onChange = jest.fn();
        
        const draggableArea = {
            getData: ({pageY}) => {
                return {
                    day: '2020-01-01',
                    minhour: '08:00',
                    maxhour: '20:00',
                    percentY: pageY,
                }
            },
            getRect: () => {},
        }
        
        const draggable = new ResizeEventDraggable(
            immutableValue,
            onChange,
            draggableArea
        );

        // @todo draggable must be an instance of IDraggable
        
        expect(draggable.getArea()).toBe(draggableArea);
        
        draggable.drag();
        expect(draggable.getCurrentValue()).toStrictEqual(immutableValue);
        
        draggable.move({pageY: 50});
        expect(draggable.getCurrentValue()).toEqual(
            expect.objectContaining({
                start: new Date("2020-01-01 10:00"),
                end:   new Date("2020-01-01 14:00"),
            })
        )

        draggable.move({pageY: 51});
        expect(draggable.getCurrentValue()).toEqual(
            expect.objectContaining({
                start: new Date("2020-01-01 10:00"),
                end:   new Date("2020-01-01 14:00"),
            })
        )

        draggable.move({pageY: 110});
        expect(draggable.getCurrentValue()).toEqual(
            expect.objectContaining({
                start: new Date("2020-01-01 10:00"),
                end:   new Date("2020-01-01 20:00"),
            })
        )

        draggable.move({pageY: -20});
        expect(draggable.getCurrentValue()).toEqual(
            expect.objectContaining({
                start: new Date("2020-01-01 10:00"),
                end:   new Date("2020-01-01 10:15"),
            })
        )

        draggable.drop({});
        expect(onChange).toHaveBeenNthCalledWith(
            1, 
            draggable.getCurrentValue(),
            immutableValue
        );
        
    })
   
    test("MonthlySheetDraggable", () => {
        
        const immutableValue = Object.freeze({
            start: new Date("2020-01-01 10:00"),
            end:   new Date("2020-01-01 12:00")
        });
        
        const onChange = jest.fn();
        
        const draggableArea = {
            getData: ({pageX}) => {
                if (pageX === 10) return { 'day': "2020-01-02" }
                if (pageX === 20) return { 'day': "2020-01-03" }
            },
            getRect: () => {}
        }
        
        const draggable = new MonthlySheetDraggable(
            immutableValue,
            onChange,
            draggableArea
        )

        // @todo draggable must be an instance of IDraggable

        expect(draggable.getArea()).toBe(draggableArea);

        const mouseEvents = {
            'drag': { pageX: 0,  pageY: 0},
            'move': { pageX: 10, pageY: 10},
            'drop': { pageX: 20, pageY: 20 }
        }

        draggable.drag(mouseEvents['drag']);
        
        expect(draggable.getCurrentValue()).toStrictEqual(immutableValue);
        
        draggable.move(mouseEvents['move']);
        
        expect(draggable.getCurrentValue()).toStrictEqual({
            start: new Date("2020-01-02 10:00"),
            end:   new Date("2020-01-02 12:00")
        });
        
        draggable.drop(mouseEvents['drop']);
        
        // @todo try to loose dependency with date.hourToString
        expect(draggable.getCurrentValue()).toStrictEqual({
            start: new Date("2020-01-03 10:00"),
            end:   new Date("2020-01-03 12:00")
        });
        
        expect(onChange).toHaveBeenNthCalledWith(
            1, 
            draggable.getCurrentValue(),
            immutableValue
        );
        
    })
    
});

describe("DraggableArea", () => {
    
    document.body.innerHTML = `
        <div>

            <div id="day-of-month-header" 
                data-day="2024-10-01"
            />
            <div id="day-of-month-body" 
            />
            <div id="day-of-week" 
                data-day="2024-10-02" 
                data-minhour = "10:00" 
                data-maxhour = "20:00"
            />

        </div>
    `;
    
    test("ElementDraggableArea", () => {

        const element = document.getElementById('day-of-month-header');
    
        const area = new ElementDraggableArea('#day-of-month-header');

        // @todo area is instance of IDraggableArea

        expect(area.getData()).toStrictEqual({
            'day': '2024-10-01',
        });
        
        jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
            x: 100, y: 100, width: 100, height: 50
        });
        
        expect(area.getRect()).toEqual(
            expect.objectContaining({
                x: 100, y: 100, width: 100, height: 50
            })        
        );

        expect(area.getData({pageX: 150, pageY: 125})).toEqual(
            expect.objectContaining({
                percentX: 50,
                percentY: 50
            })                    
        );
        
    });
    
    test("CompositeDraggableArea", () => {
        
        const children = [
            {
                getData: () => ({'value': 'foo'}),
                getRect: () => ({
                    x: 10, y: 10, width: 10, height: 10
                })
            },
            {
                getData: () => ({'value': 'bar'}),
                getRect: () => ({
                    x: 100, y: 10, width: 10, height: 10
                })
            }
        ]
        
        const area = new CompositeDraggableArea(children);
        
        // @todo area is instance of IDraggableArea
        
        expect(area.getChildren()).toStrictEqual(children);
        
        // @todo try to loose dependency with Rectangle.createBounding
        expect(area.getRect()).toEqual(
            expect.objectContaining({
                x: 10, y: 10, width: 100, height: 10
            })
        )

        expect(area.getClosestChild({ pageX: 5, pageY: 5 }))
            .toBe(children[0]);
    
        expect(area.getClosestChild({ pageX: 99, pageY: 5 }))
            .toBe(children[1]);
    
        expect(area.getData({ pageX: 5, pageY: 5 }))
            .toStrictEqual({'value': 'foo'});
    
        expect(area.getData({ pageX: 99, pageY: 5 }))
            .toStrictEqual({'value': 'bar'});
        
    });
    
});