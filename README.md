# @mormat/react-scheduler

React scheduler component

week view                 | month view
:-------------------------:|:-------------------------:
![preview](docs/week-view.png) | ![preview](docs/month-view.png)

This component can alse be used in a legacy project ( [see below](#usage-in-a-legacy-website) )

- [Demo](https://mormat.github.io/react-scheduler/)

## Available features
- switch between views `day`, `week` or `month`
- events can be loaded [statically](#loading-static-events) (from an array) or [dynamically](#loading-dynamic-events) (from an ajax request for instance)
- drag and drop events
- create/update/delete events
- few dependencies : only `React` (>= 17.0.0) and `ReactDOM` (>= 17.0.0) are required 


## Usage in a React project

### Installing

```
npm install @mormat/react-scheduler
```

### Loading static events

```js
import Scheduler from "@mormat/react-scheduler";

function App() {
    
    const events = [
        {
            label: "Meeting",
            start: "2024-02-28 10:00",
            end:   "2024-02-28 12:00",
        }
    ];

    return (
        <Scheduler 
            events      = { events } 
            initialDate = "2024-02-28"
        />
    );
    
}
```

### Loading dynamic events

export default App;

## Usage in a legacy website

1. First, you need to add the React and ReactDOM libraries in your HTML page
```html
    <script src="//unpkg.com/react@18/umd/react.development.js"></script>
    <script src="//unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

2. Download [mormat_react_scheduler.js](https://github.com/mormat/react-scheduler/releases/latest) in the release page then add it to your HTML page.
```html
    <script src="./mormat_react_scheduler.js"></script>
```

3. Then add the lines below to render the scheduler
```html
    <div id="scheduler"></div>
    <script>
        var props = { 
            /* the same props used in a React project */ 
        };
        mormat_react_scheduler.renderScheduler('#scheduler', props);
    </script>
```

The expected props can be found in [src/types.ts](src/types.ts)

## How it works



Inline CSS are used for styling. To avoid conflicts, all classNames are prefixed with `mormat-scheduler-*`