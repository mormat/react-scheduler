@crud
Feature: Managing events in scheduler

    Background:
        Given the date today is "2023-05-01 10:00" 
        And "events" in configuration equals:
            """
                function(setEvents) {
                    setEvents([
                        {
                            id:    1,
                            label: "Presentation",
                            start: "2023-05-01 14:00",
                            end:   "2023-05-01 16:00"
                        },
                        {
                            id:    2,
                            label: "Training course",
                            start: "2023-05-01 08:00",
                            end:   "2023-05-02 18:00"
                        }
                    ]);
                }
            """

    @drag_and_drop 
    Scenario Outline: Notify when an event has been dragged and dropped in "week" and "day" view 
        Given "onEventUpdate" in configuration equals:
            """
                function(event, { previous }) {
                    notify(
                        `${event.label} event was moved `+ 
                        `from '${previous.getStartAsString('hh:ii')} - ${previous.getEndAsString('hh:ii')}' `+ 
                        `to '${event.getStartAsString('hh:ii')} - ${event.getEndAsString('hh:ii')}'`
                    );
                }
            """
        When I open the scheduler in "<view_mode>" view
        And I move the "Presentation" event to "2023-05-01" at "08:00"
        Then I should see the "Presentation" event in "2023-05-01"
        And the "Presentation" event should be displayed from '08:00' to '10:00'
        And I should see in notifications:
        """
            Presentation event was moved from '14:00 - 16:00' to '08:00 - 10:00'
        """

    Examples:
        | view_mode |
        | day       |
        | week      |

    @drag_and_drop 
    Scenario Outline: Reset events after drag and drop in "week" and "day" view
        Given "onEventUpdate" in configuration equals:
            """
                function(event, { reset }) {
                    reset();
                }
            """
        When I open the scheduler in "<view_mode>" view
        And I move the "Presentation" event to "2023-05-01" at "08:00"
        Then I should see the "Presentation" event in "2023-05-01"
        And the "Presentation" event should be displayed from '14:00' to '16:00'

    Examples:
        | view_mode |
        | day       |
        | week      |

    
    @drag_and_drop
    Scenario: Notify when an event has been dragged and dropped in "month" view 
        Given "onEventUpdate" in configuration equals:
            """
                function(event, { previous }) {
                    notify(
                        `${event.label} event was moved ` + 
                        `from '${previous.getStartAsString('yyyy-mm-dd')}' ` + 
                        `to '${event.getStartAsString('yyyy-mm-dd')}'`
                    );
                }
            """
        When I open the scheduler in "month" view
        And I move the "Presentation" event to "2023-05-02"
        Then the events below should be displayed only in the corresponding day
            | Presentation | 2023-05-02 |
        And I should see in notifications:
        """
            Presentation event was moved from '2023-05-01' to '2023-05-02'
        """

    @drag_and_drop
    Scenario Outline: Reset events the way it was before after drag and drop in "month" view
        Given "onEventUpdate" in configuration equals:
            """
                function(event, { reset } ) {
                    reset();
                }
            """
        When I open the scheduler in "month" view
        And I move the "Presentation" event to "2023-05-02"
        Then the events below should be displayed only in the corresponding day
            | Presentation | 2023-05-01 |

    Scenario Outline: Creating a dynamically loaded event
        Given "onEventCreate" in configuration equals:
            """
                (event) => notify(`
                    An event was created with
                    - id : ${event.id}
                    - label : ${event.label}
                `)
            """
        When I open the scheduler in "<view_mode>" view
        And I create an event with:
            | Description | new event |
        Then I should see "new event"
        And I should see all the items below in notifications:
            | An event was created with |  
            | - label : new event       |
        And I should see text matching "id : (\w*)-(\w*)-(\w*)-(\w*)-(\w*)" in notifications

        Examples:
            | view_mode |
            | day       |
            | week      |
            | month     |
            
    Scenario Outline: Notify when an event has been updated
        Given "onEventUpdate" in configuration equals:
            """
                function(event, { previous }) {
                    notify(`'${previous.label}' was replaced by '${event.label}' in event #${event.id}`);
                }
            """
        When I open the scheduler in "<view_mode>" view
        And I update the "<event_label>" event with:
            | Description | updated event |
        Then I should see "updated event"
        And I should see in notifications:
        """
            '<event_label>' was replaced by 'updated event' in event #<event_id>
        """
    
    Examples:
            | view_mode | event_label     | event_id |
            | day       | Presentation    | 1        |
            | day       | Training course | 2        |
            | week      | Presentation    | 1        |
            | week      | Training course | 2        |
            | month     | Presentation    | 1        |
            | month     | Training course | 2        |

    Scenario Outline: Rendering colors
        When I open the scheduler in "<view_mode>" view
        And I <create_or_update_event> with:
            | Description | updated |
            | Color       | #9575cd |
        Then the "updated" event should be rendered with
            | background-color | #9575cd |
            | color            | white   |

    Examples:
        | view_mode | create_or_update_event                |
        | day       | create an event                       |
        | day       | update the "Presentation" event       |
        | day       | update the "Training course" event    |
        | week      | create an event                       |
        | week      | update the "Presentation" event       |
        | week      | update the "Training course" event    |
        | month     | create an event                       |
        | month     | update the "Presentation" event       |
        | month     | update the "Training course" event    |
    
    
    Scenario Outline: Reset events after create/update
        Given "onEventCreate" in configuration equals:
            """
                function(event, { reset }) { reset(); }
            """
        And "onEventUpdate" in configuration equals:
            """
                function(event, { reset }) { reset(); }
            """
        When I open the scheduler in "<view_mode>" view
        And I <create_or_update_event> with:
            | Description | some event |
        Then I should not see "some event"

    Examples:
        | view_mode | create_or_update_event                |
        | day       | create an event                       |
        | day       | update the "Presentation" event       |
        | day       | update the "Training course" event    |
        | week      | create an event                       |
        | week      | update the "Presentation" event       |
        | week      | update the "Training course" event    |
        | month     | create an event                       |
        | month     | update the "Presentation" event       |
        | month     | update the "Training course" event    |

    Scenario Outline: Description required
        When I open the scheduler in "<view_mode>" view
        And I <create_or_update_event> with:
            | Description | |
        Then I should see "description required"
        
    Examples:
        | view_mode | create_or_update_event                |
        | day       | create an event                       |
        | day       | update the "Presentation" event       |
        | day       | update the "Training course" event    |
        | week      | create an event                       |
        | week      | update the "Presentation" event       |
        | week      | update the "Training course" event    |
        | month     | create an event                       |
        | month     | update the "Presentation" event       |
        | month     | update the "Training course" event    |

    Scenario Outline: Invalid date range
        When I open the scheduler in "<view_mode>" view
        And I <create_or_update_event> with:
            | From | 11:00 22 April 2023 |
            | To   | 10:00 22 April 2023 |
        Then I should see "invalid date range"

    Examples:
        | view_mode | create_or_update_event                |
        | day       | create an event                       |
        | day       | update the "Presentation" event       |
        | day       | update the "Training course" event    |
        | week      | create an event                       |
        | week      | update the "Presentation" event       |
        | week      | update the "Training course" event    |
        | month     | create an event                       |
        | month     | update the "Presentation" event       |
        | month     | update the "Training course" event    |

    Scenario Outline: Delete event
        Given "onEventDelete" in configuration equals:
            """
                function(event) {
                    notify(`event #${event.id} was deleted`);
                }
            """
        When I open the scheduler in "<view_mode>" view
        And I delete the "<event_label>" event
        Then I should not see "<event_label>"
        And I should see in notifications:
        """
            event #<event_id> was deleted
        """

    Examples:
        | view_mode | event_label     | event_id |
        | day       | Presentation    | 1        |
        | day       | Training course | 2        |
        | week      | Presentation    | 1        |
        | week      | Training course | 2        |
        | month     | Presentation    | 1        |
        | month     | Training course | 2        |

    Scenario Outline: Reset events after delete
        Given "onEventDelete" in configuration equals:
            """
                function(event, { reset }) { reset(); }
            """
        When I open the scheduler in "<view_mode>" view
        And I delete the "<event_label>" event
        Then I should see "<event_label>"

    Examples:
        | view_mode | event_label     |
        | day       | Presentation    |
        | day       | Training course |
        | week      | Presentation    |
        | week      | Training course |
        | month     | Presentation    |
        | month     | Training course |
