
import { formatters, getPercentInDateRange } from '../utils/date';

function DayColumnDraggableRenderer() {
    
    let clone = null;
    let targetRole = null;
    let dragArea = null;
    
    const renderers = {
        'drag': ({e, action, draggable}) => {
            clone = e.currentTarget.cloneNode(true);
            clone.style['display'] = 'none';
            document.body.appendChild(clone);
            
            targetRole = e.target.dataset['action'];
            dragArea = draggable.getArea().getClosestChild(e);
        },
        'move': ({e, action, draggable}) => {
            
            let area;
            if (targetRole === 'resize') {
                area = dragArea;
            } else {
                area = draggable.getArea().getClosestChild(e)
            }
            
            const rect  = area.getRect();
            
            const { day, minhour, maxhour } = area.getData(e);
            
            const constraint = {
                start: new Date(day + ' ' + minhour),
                end:   new Date(day + ' ' + maxhour),
            }
            
            const currentValue = draggable.getCurrentValue();
            
            const topPercent = Math.max(getPercentInDateRange(currentValue.start, constraint), 0);
            const heightPercent = Math.min(getPercentInDateRange(currentValue.end, constraint), 1) - topPercent;

            clone.style['position'] = 'absolute';
            clone.style['display']  = 'block';
            clone.style['left']     = rect.x + 'px';
            clone.style['width']    = rect.width + 'px';
            clone.style['height']   = (rect.height * heightPercent) + 'px';
            clone.style['top']      = (rect.y + rect.height * topPercent) + 'px';
            
            // displays new starting and ending time in the event
            const [from, to] = clone.querySelectorAll('[data-type="hour"]');
            from.innerHTML = formatters['hh:ii'](currentValue.start);
            to.innerHTML = formatters['hh:ii'](currentValue.end);
        },
        'drop': () => {
            document.body.removeChild(clone);
            clone = null;
        }
    }
    
    return (props) => {
        if (props.action in renderers) {
            renderers[props.action](props)
        }
    }
}

function MonthlySheetDraggableRenderer() {
    
    let clone = null;
    
    const renderers = {
        'drag': ({e, action, draggable}) => {
            clone = e.currentTarget.cloneNode(true);
            clone.style['display'] = 'none';
            document.body.appendChild(clone);
        },
        'move': ({e, action, draggable}) => {
            const area  = draggable.getArea().getClosestChild(e);

            for (const child of area.getChildren()) {
                const data = child.getData(e);
                if (data['role'] !== 'header') continue;

                const { x, y, height, width } = child.getRect();
                clone.style['position'] = 'absolute';
                clone.style['display']  = 'block';
                clone.style['left'] = x + 'px';
                clone.style['top']  = (y + height) + 'px';
                clone.style['width']  = width + 'px';
            }
        },
        'drop': () => {
            document.body.removeChild(clone);
            clone = null;
        }
    }
    
    return (props) => {
        if (props.action in renderers) {
            renderers[props.action](props)
        }
    }
    
}

export { MonthlySheetDraggableRenderer, DayColumnDraggableRenderer }
