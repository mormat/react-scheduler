@crud
Feature: Managing events in scheduler

    Background:
        Given the date today is "2023-05-01 10:00" 
        And "events" in configuration equals:
            """
                function(setEvents) {
                    setEvents([
                        {
                            label: "Presentation",
                            start: "2023-05-01 14:00",
                            end:   "2023-05-01 16:00"
                        },
                        {
                            label: "Training course",
                            start: "2023-05-01 08:00",
                            end:   "2023-05-02 18:00"
                        }
                    ]);
                }
            """

    @drag_and_drop 
    Scenario Outline: Moving a dynamically loaded event in "week" view
        Given "onEventUpdate" in configuration equals:
            """
                function(event, _, reload) {
                    <update_script>;
                }
            """
        When I open the scheduler in "<view_mode>" view
        And I move the "Presentation" event to "2023-05-01" at "08:00"
        Then I should see the "Presentation" event in "2023-05-01"
        And the "Presentation" event should be displayed <at_time_range>

    Examples:
        | view_mode | update_script | at_time_range           |
        | day       |               | from "08:00" to "10:00" |
        | day       | reload()      | from "14:00" to "16:00" |
        | week      |               | from "08:00" to "10:00" |
        | week      | reload()      | from "14:00" to "16:00" |
        

    @drag_and_drop
    Scenario Outline: Moving a dynamically loaded event in "month" view
        Given "onEventUpdate" in configuration equals:
            """
                function(event, _, reload) {
                    <update_script>
                    console.log(`${event.label} event was moved`);
                }
            """
        When I open the scheduler in "month" view
        And I move the "Presentation" event to "<expected_day>"
        Then the events below should be displayed only in the corresponding day
            | Presentation | <expected_day> |
        And the logs should contain the info:
        """
            Presentation event was moved
        """

    Examples:
        | update_script | expected_day |
        |               | 2023-05-02   |
        | reload();     | 2023-05-01   |

    
    Scenario Outline: Creating a dynamically loaded event
        Given "onEventCreate" in configuration equals:
            """
                function(event, _, reload) {
                    console.log(`${event.label} was created`);
                }
            """
        When I open the scheduler in "<view_mode>" view
        And I create an event with:
            | Description | new event |
        Then I should see "new event"
        And the logs should contain the info:
        """
            new event was created
        """

        Examples:
            | view_mode |
            | day       |
            | week      |
            | month     |
            
    Scenario Outline: Editing a dynamically loaded event
        Given "onEventUpdate" in configuration equals:
            """
                function(event, old) {
                    console.log(`${old.label} was replaced by ${event.label}`);
                }
            """
        When I open the scheduler in "<view_mode>" view
        And I update the "<event_label>" event with:
            | Description | updated event |
        Then I should see "updated event"
        And the logs should contain the info:
        """
            <event_label> was replaced by updated event
        """
    
    Examples:
            | view_mode | event_label     |
            | day       | Presentation    |
            | day       | Training course |
            | week      | Presentation    |
            | week      | Training course |
            | month     | Presentation    |
            | month     | Training course |

    
    Scenario Outline: Reloading events after create/update
        Given "onEventCreate" in configuration equals:
            """
                function(event, _, reload) { reload(); }
            """
        And "onEventUpdate" in configuration equals:
            """
                function(event, _, reload) { reload(); }
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

    Scenario Outline: Description required when creating or editing events
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
                    console.log(`${event.label} was deleted`);
                }
            """
        When I open the scheduler in "<view_mode>" view
        And I delete the "<event_label>" event
        Then I should not see "<event_label>"
        And the logs should contain the info:
        """
            <event_label> was deleted
        """

    Examples:
        | view_mode | event_label     |
        | day       | Presentation    |
        | day       | Training course |
        | week      | Presentation    |
        | week      | Training course |
        | month     | Presentation    |
        | month     | Training course |

    Scenario Outline: Reloading events after delete
        Given "onEventDelete" in configuration equals:
            """
                function(event, reload) { reload(); }
            """
        When I open the scheduler in "<view_mode>" view
        And I delete the "<event_label>" event
        Then I should see "<event_label>"

    Examples:
        | view_mode | event_label  |
        | day       | Presentation |
        | day       | Training course |
        | week      | Presentation    |
        | week      | Training course |
        | month     | Presentation    |
        | month     | Training course |
