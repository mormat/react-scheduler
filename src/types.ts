interface ISchedulerOptions {

    initialDate: date|number|string;

    viewMode: string;

    onEventCreate: any;

    onEventUpdate: any;

    onEventDelete: any;

    defaultEventColor: string;

    defaultEventBgColor: string;

    locale: string;

    width: number;

    height: number;

    spannedEventHeight: number;

    minHour: number;

    maxHour: number;

    draggable: boolean;
    
    // enableOverlapping: boolean;

}

interface ISchedulerConfig {

    firstHour: number;

    lastHour: number;

    initialDate: date|number|string;

    events: any[];

    viewMode: string;

}



export { ISchedulerOptions, ISchedulerConfig }
