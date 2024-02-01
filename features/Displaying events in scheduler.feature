Feature: Displaying events in the scheduler

    Background:
        Given the date today is "2023-05-01" 
        And the configuration contains the following events:
            | start            | end              | label           |
            | 2023-05-01 10:00 | 2023-05-01 12:00 | Presentation    |
            | 2023-05-05 14:00 | 2023-05-06 16:00 | Meeting         |
            | 2023-05-07  9:00 | 2023-05-07 10:00 | Medical checkup |
            | 2023-04-28  9:00 | 2023-04-28 18:00 | Training course |
            | 2023-05-09 11:00 | 2023-05-09 12:00 | Job Interview   |

    Scenario: Displaying events for current week    
        When I open the scheduler in "week" view
        Then only the items checked below should be visible
            | Presentation    | X |
            | Meeting         | X |  
            | Medical checkup | X |  
            | Job Interview   |   |
            | Training course |   |  
    
    Scenario: Displaying events for next week
        When I open the scheduler in "week" view
        And I click on ">"
        Then only the items checked below should be visible
            | Presentation    |   |
            | Meeting         |   |  
            | Medical checkup |   |  
            | Job Interview   | X |
            | Training course |   |  

    Scenario: Displaying events for previous week
        When I open the scheduler in "week" view
        And I click on "<"
        Then only the items checked below should be visible
            | Presentation    |   |
            | Meeting         |   |  
            | Medical checkup |   |  
            | Job Interview   |   |
            | Training course | X |  

    Scenario: Event should be displayed at the corresponding time range
        When I open the scheduler in "week" view
        Then the "Presentation" event should be at "2023-05-01" from "10:00" to "12:00"
        And I should see "10:00 - 12:00 Presentation"

    @drag_and_drop
    Scenario: Displaying an event that has been moved in week view
        Given "onEventUpdate" in configuration equals:
            """
                function(event) {
                    console.log(`${event.label} event was moved`);
                }
            """
        When I open the scheduler in "week" view
        And I move the "Presentation" event to "2023-05-02" at "08:00"
        Then the "Presentation" event should be at "2023-05-02" from "08:00" to "10:00"
        And the logs should contain the info:
        """
            Presentation event was moved
        """

    Scenario: Default ending time is "start + 60 minutes"
        Given the configuration contains the following events:
            | start            | label    |
            | 2023-05-01 12:30 | lunch    |
        When I open the scheduler in "week" view
        Then I should see "12:30 - 13:30 lunch"

    Scenario: Displaying events for the current day
        When I open the scheduler in "day" view
        Then only the items checked below should be visible
            | Presentation    | X |
            | Meeting         |   |  
            | Medical checkup |   |  
            | Job Interview   |   |
            | Training course |   |

    Scenario: Displaying events for the next day
        Given the configuration contains the following events:
            | start            | label          |
            | 2023-05-02 14:00 | Next day event |
        When I open the scheduler in "day" view
        And I click on ">"
        Then only the items checked below should be visible
            | Next day event  | X |
            | Presentation    |   |

    Scenario: Displaying events for the previous day
        Given the configuration contains the following events:
            | start            | label              |
            | 2023-04-30 14:00 | Previous day event |
        When I open the scheduler in "day" view
        And I click on "<"
        Then only the items checked below should be visible
            | Previous day event | X |
            | Presentation       |   |

    Scenario: Displaying events for the current month
        Given the configuration contains the following events:
            | start      | end        | label                  |
            | 2023-05-21 | 2023-05-22 | Overlapping week event |
        When I open the scheduler in "month" view
        Then the events below should be displayed only in the corresponding day
            | Presentation           | 2023-05-01 |
            | Medical checkup        | 2023-05-07 |  
            | Job Interview          | 2023-05-09 |
            | Meeting                | 2023-05-05,2023-05-06 |
            | Overlapping week event | 2023-05-21,2023-05-22 |
           
    Scenario: Displaying events for the next month
        Given the configuration contains the following events:
            | start      | end        | label            |
            | 2023-06-10 | 2023-06-10 | Next month event |
        When I open the scheduler in "month" view
        And I click on ">"
        Then only the items checked below should be visible
            | Next month event | X |
            | Presentation     |   |

    Scenario: Displaying events for the previous month
        Given the configuration contains the following events:
            | start           | end          | label            |
            | 2023-04-10      | 2023-04-10   | Previous month event |
        When I open the scheduler in "month" view
        And I click on "<"
        Then only the items checked below should be visible
            | Previous month event | X |
            | Presentation         |   |

    @drag_and_drop
    Scenario: Displaying an event that has been moved in month view
        When I open the scheduler in "month" view
        And I move the "Meeting" event to "2023-05-03"
        And I move the "Presentation" event to "2023-05-02"
        Then the events below should be displayed only in the corresponding day
            | Presentation    | 2023-05-02 |
            | Meeting         | 2023-05-03,2023-05-04 |

    Scenario Outline: Rendering events color in day/week/month view
        Given the configuration contains the following events:
            | start            | end              | label       | bgColor | color |
            | 2023-05-01 14:00 | 2023-05-01 15:00 | daily based | red     | white |
            | 2023-05-01       | 2023-05-02       | spanning    | pink    | black |
        And the configuration contains the following events:
            | start            | end              | label                  |
            | 2023-05-01 14:00 | 2023-05-01 15:00 | colourless daily based |
            | 2023-05-01       | 2023-05-02       | colourless spanning    |
        When I open the scheduler in "<view_mode>" view
        Then the "daily based" event should be rendered with
            | background-color | red   |
            | color            | white |
        And the "spanning" event should be rendered with
            | background-color | pink  |
            | color            | black |
        And the "colourless daily based" event should be rendered with
            | background-color | #0288d1 |
            | color            | white   |
        And the "colourless spanning" event should be rendered with
            | background-color | #0288d1 |
            | color            | white   |
            
        Examples:
            | view_mode |
            | day       |
            | week      |
            | month     |

    Scenario Outline: Loading events with function
        Given "events" in configuration equals:
            """
                function(setEvents, params) {
                    console.log(`loading events from ${params.start} to ${params.end}`)
                    setEvents([{
                        label: "dynamically loaded event",
                        start: "2023-05-01 10:00",
                        end: "2023-05-01 12:00"
                    }]);
                }
            """
        When I open the scheduler in "<view_mode>" view
        Then I should see "dynamically loaded event"
        And the logs should contain the info:
        """
            loading events from <start_date> to <end_date>
        """
 
    Examples:
        | view_mode  | start_date       | end_date         |
        | day        | 2023-05-01 00:00 | 2023-05-01 23:59 |
        | week       | 2023-05-01 00:00 | 2023-05-07 23:59 |
        | month      | 2023-05-01 00:00 | 2023-06-04 23:59 |

    @drag_and_drop
    Scenario Outline: Moving a dynamically loaded event in "day" and "week" view
        Given "events" in configuration equals:
            """
                function(setEvents) {
                    setEvents([{
                        label: "dynamically loaded",
                        start: "2023-05-01 14:00",
                        end:   "2023-05-01 16:00"
                    }]);

                }
            """
        And "onEventUpdate" in configuration equals:
            """
                function(event, _, reload) {
                    <update_script>
                    console.log(`${event.label} event was moved`);
                }
            """
        When I open the scheduler in "<view_mode>" view
        And I move the "dynamically loaded" event to "2023-05-01" at "<start_hour>"
        Then the "dynamically loaded" event should be at "2023-05-01" from "<start_hour>" to "<end_hour>"
        And the logs should contain the info:
        """
            dynamically loaded event was moved
        """

    Examples:
        | view_mode  | update_script | start_hour | end_hour |
        | day        |               | 08:00      | 10:00    |
        | day        | reload();     | 14:00      | 16:00    |
        | week       |               | 08:00      | 10:00    |
        | week       | reload();     | 14:00      | 16:00    |

