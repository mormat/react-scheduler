@admin
Feature: Managing events
    
    Scenario: Displaying events manager
        When I open the events manager
        Then I should see "No events defined yet"

    Scenario: Displaying scheduled events
        Given the configuration contains the following events:
            | label      | start           | end              |
            | some event | 2023-05-21 9:00 | 2023-05-21 12:00 |
        When I open the events manager
        Then I should see "some event from 5/21/2023 09:00 to 5/21/2023 12:00"

    Scenario: Creating an event
        Given "onEventCreate" in configuration equals:
            """
                (e) => console.log(
                    `Event was created`,
                    'id: ' + e.id,
                    'label: ' + e.label,
                    'start: ' + e.start,
                    'end: '   + e.end,
                )
           """
        When I open the events manager
        And I fill "new event" in "Description"
        And I select the time periods below:
           |       | time  | day | month | year |
           | From  | 10:00 | 21  | May   | 2023 |
           | To    | 12:00 | 21  | May   | 2023 |
        And I click on "Ok"
        Then I should see "new event from 5/21/2023 10:00 to 5/21/2023 12:00"
        Then the logs should contain the infos:
            | Event was created            |
            | id: new_1                    |
            | label: new event             |
            | start: Sun May 21 2023 10:00 |
            | end: Sun May 21 2023 12:00   |

    Scenario: Updating an event
        Given the configuration contains the following events:
            | id | label      | start           | end              |
            | 5  | some event | 2023-05-21 9:00 | 2023-05-21 12:00 |
        And "onEventUpdate" in configuration equals:
            """
                (e) => console.log(
                    'Event was updated',
                    'id: ' + e.id,
                    'label: ' + e.label,
                    'start: ' + e.start,
                    'end: '   + e.end,
                )
           """
        When I open the events manager
        And I click on "some event"
        And I fill "updated event" in "Description"
        And I select the time periods below:
           |       | time  | day | month | year |
           | From  | 14:00 | 22  | May   | 2023 |
           | To    | 16:00 | 22  | May   | 2023 |
        And I click on "Ok"
        Then I should see "updated event from 5/22/2023 14:00 to 5/22/2023 16:00"
        And I should not see "some event from 5/21/2023 09:00 to 5/21/2023 12:00"
        Then the logs should contain the infos:
        | Event was updated            |
        | id: 5                        |
        | label: updated event         |
        | start: Mon May 22 2023 14:00 |
        | end: Mon May 22 2023 16:00   |

    Scenario: Deleting an event
        Given the configuration contains the following events:
            | id | label      | start            | end              |
            | 5  | some event | 2023-05-21 9:00  | 2023-05-21 12:00 |
            | 6  | old event  | 2023-05-21 14:00 | 2023-05-21 16:00 |
        And "onEventDelete" in configuration equals:
            """
                function(e) {
                    console.log(`Event '${e.id}' was deleted`)
                }
           """
        When I open the events manager
        And I delete "old event" Event
        Then I should not see "old event"
        And I should see "some event"
        Then the logs should contain the infos:
            | Event '6' was deleted |