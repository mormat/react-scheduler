interface ISchedulerOptions {

    initialDate: date|number|string; // if set, the scheduler will start at this date

    viewMode: string;   // 'day', 'week' or 'month'

    locale: string;     // i18n 

    width: number;      // width of the scheduler in pixel

    height: number;     // height of the scheduler in pixel

    minHour: number;

    maxHour: number;

    editable: boolean;  // if true, the user can create/update/delete events

    draggable: boolean; // if true, the user can drag and drop events

    onEventCreate: any; // triggered when the user create an event

    onEventUpdate: any; // triggered when the user update an event

    onEventDelete: any; // triggered when the user delete an event

    defaultEventColor: string;

    defaultEventBgColor: string;

    spannedEventHeight: number;

}

interface ISchedulerConfig extends ISchedulerOptions {

    events: any[];

}

export { ISchedulerOptions, ISchedulerConfig }
