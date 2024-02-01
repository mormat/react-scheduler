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
        Then the "Presentation" event should be at "2023-05-01" <expected>

    Examples:
        | view_mode | update_script | expected                |
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

    Scenario Outline: Adding a dynamically loaded event
        Given "onEventCreate" in configuration equals:
            """
                function(event, _, reload) {
                    console.log(`${event.label} was created`);
                }
            """
        When I open the scheduler in "<view_mode>" view
        And I click on "Add event"
        And I fill "new event" in "Description"
        And I click on "Ok"
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
        And I click on "Edit event" in "<event_label>" event
        And I fill "updated event" in "Description"
        And I click on "Ok"
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
        And I click on <item_to_click>
        And I fill "some event" in "Description"
        And I click on "Ok"
        Then I should not see "some event"

    Examples:
        | view_mode | item_to_click                           |
        | day       | "Add event"                             |
        | day       | "Edit event" in "Presentation" event    |
        | day       | "Edit event" in "Training course" event |
        | week      | "Add event"                             |
        | week      | "Edit event" in "Presentation" event    |
        | week      | "Edit event" in "Training course" event |
        | month     | "Add event"                             |
        | month     | "Edit event" in "Presentation" event    |
        | month     | "Edit event" in "Training course" event |        

    Scenario Outline: Description required when creating or editing events
        When I open the scheduler in "<view_mode>" view
        And I click on <item_to_click>
        And I fill "" in "Description"
        And I click on "Ok"
        Then I should see "description required"
        
    Examples:
        | view_mode | item_to_click                           |
        | day       | "Add event"                             |
        | day       | "Edit event" in "Presentation" event    |
        | day       | "Edit event" in "Training course" event |
        | week      | "Add event"                             |
        | week      | "Edit event" in "Presentation" event    |
        | week      | "Edit event" in "Training course" event |
        | month     | "Add event"                             |
        | month     | "Edit event" in "Presentation" event    |
        | month     | "Edit event" in "Training course" event |        

    Scenario Outline: Invalid date range
        When I open the scheduler in "<view_mode>" view
        And I click on <item_to_click>
        And I select the dates below:
            |      | time  | day | month   | year |
            | From | 11:00 | 22  | April   | 2023 |
            | To   | 10:00 | 22  | April   | 2023 |
        And I click on "Ok"
        Then I should see "invalid date range"

    Examples:
        | view_mode | item_to_click                           |
        | day       | "Add event"                             |
        | day       | "Edit event" in "Presentation" event    |
        | day       | "Edit event" in "Training course" event |
        | week      | "Add event"                             |
        | week      | "Edit event" in "Presentation" event    |
        | week      | "Edit event" in "Training course" event |
        | month     | "Add event"                             |
        | month     | "Edit event" in "Presentation" event    |
        | month     | "Edit event" in "Training course" event |    

    @current
    Scenario Outline: Delete event
        Given "onEventDelete" in configuration equals:
            """
                function(event) {
                    console.log(`${event.label} was deleted`);
                }
            """
        When I open the scheduler in "<view_mode>" view
        And I click on "Edit event" in "<event_label>" event
        And I click on "Delete"
        And I confirm "Deleting event ?"
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
        And I click on "Edit event" in "<event_label>" event
        And I click on "Delete"
        And I confirm "Deleting event ?"
        Then I should see "<event_label>"

    Examples:
        | view_mode | event_label  |
        | day       | Presentation |
        | day       | Training course |
        | week      | Presentation    |
        | week      | Training course |
        | month     | Presentation    |
        | month     | Training course |
