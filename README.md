# @mormat/react-scheduler 

A google-like scheduler component for React

week view                 | month view
:-------------------------:|:-------------------------:
![preview](docs/week-view.png) | ![preview](docs/month-view.png)

[Demo](https://mormat.github.io/react-scheduler/) -
[Examples](https://mormat.github.io/react-scheduler/examples.html)

This is mostly a wrapper of this [web component](https://mormat.github.io/jscheduler_ui/)

Available features :
- switch between views `day`, `week` or `month`
- drag and drop events
- create/update/delete events
- few dependencies : only `React` (>= 17.0.0) and `ReactDOM` (>= 17.0.0) are required.



## Installation

```
npm install @mormat/react-scheduler
```

### Stylesheet

The following line can be included in your `src/index.js` or `App.js` file
```
import '@mormat/react-scheduler/dist/react_scheduler.css'
```

The css can also be loaded using [unpkg](https://unpkg.com)
```html
<head>
    <link 
        rel="stylesheet" 
        href="https://unpkg.com/@mormat/react-scheduler/dist/react_scheduler.css"
    >
</head>
```

## Usage

### Importing the component

```js
import Scheduler from "@mormat/react-scheduler";
```

### Loading some events

```js
import { render } from 'react-dom';

const currentDate = "2024-10-08";

const events = [
    { "label": "interview",  "start": "2024-10-08 10:00", "bgColor": "#0288d1" },
    { "label": "conference", "start": "2024-10-09 14:00", "end": "2024-10-09 18:00", "bgColor": "#9575cd" },
    { "label": "meeting", "start": "2024-10-11 09:00", "end": "2024-10-11 18:00", "bgColor": "#0fc4a7" },
    { "label": "training course", "start": "2024-10-08 09:00", "end": "2024-10-11 18:00", "bgColor": "#856404" },
]

render(
    <Scheduler 
        currentDate = { currentDate } 
        events = { events } 
    />, 
    document.getElementById('scheduler')
);
```

### More examples

[https://mormat.github.io/react-scheduler/examples.html](https://mormat.github.io/react-scheduler/examples.html)

## Availables props

### `events`

The events can be defined with a static array or a function for dynamic loading

#### Using an array of objects 
Each object should at least contains the attributes below:
| attr    | type      | description        |
|-|-|-|
| `label` | string    | Describe the event |
| `start` | string|integer|Date |  Start of the event. The value must be compliant with the constructor of [Date()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date) |
| `end`   | string|integer|Date |  End of the event. The value must be compliant with the constructor of [Date()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date) |

#### Using a function for dynamic loading

See example here : [loading dynamic events](https://mormat.github.io/react-scheduler/examples.html?p=loading_ajax_events)

### `currentDate`: string|date|integer

If defined, the scheduler will start displaying events from this date.

The value must be compliant with the constructor of [Date()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date)

### `viewMode`: string

If defined, the scheduler will start displaying events from this specific view mode.

Expected values are `day`, `week`, `month`

### `dateLocale`: string

The i18n locale used to format dates. 

For instances: `en`, `it`, `es` ...

### `onEventAdd`: callback

A listener called when the user add a event on the scheduler

See example [Creating event](https://mormat.github.io/react-scheduler/examples.html?p=creating_event)

### `onEventEdit`: callback

A listener called when the user edit a event on the scheduler

See example [Edit event](https://mormat.github.io/react-scheduler/examples.html?p=editing_event)

### `onEventDrop`: callback

A listener called when the user drop on event on the scheduler

See example [Drag and drop event](https://mormat.github.io/react-scheduler/examples.html?p=drag_and_drop_event)

### `onEventResize`: callback

A listener called when the user resize an event on the scheduler

See example [Drag and drop event](https://mormat.github.io/react-scheduler/examples.html?p=resize_event)
