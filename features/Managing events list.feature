@admin
Feature: Managing events list

    Scenario Outline: Displaying list with events
        Given the configuration contains:
            | name | <form_name> |
        And the configuration contains the following events:
            | label          | start            | end              |
            | some event     | 2023-05-21 9:00  | 2023-05-21 12:00 |
            | another event  | 2023-05-21 14:00 | 2023-05-21 16:00 |
        When I open the events list
        Then the value "<form_name>[items]" of the '#main' form should equals:
            | label          | start            | end              |
            | some event     | 2023-05-21 09:00 | 2023-05-21 12:00 |
            | another event  | 2023-05-21 14:00 | 2023-05-21 16:00 |

    Examples:
        | form_name  |
        | events     |
        | values     |

    Scenario: Adding event
        Given the date today is "2023-05-01 10:00" 
        When I open the events list
        And I click on "Add event"
        Then the value "events[items]" of the '#main' form should equals:
            | label  | start            | end              |
            |        | 2023-05-01 10:00 | 2023-05-01 10:15 |

    Scenario: Deleting event
        Given the configuration contains the following events:
            | label          | start            | end              |
            | some event     | 2023-05-21 9:00  | 2023-05-21 12:00 |
            | another event  | 2023-05-21 14:00 | 2023-05-21 16:00 |
        When I open the events list
        And I click on "delete" in "[data-nth-event='2']"
        Then the value "events[items]" of the '#main' form should equals:
            | label          | start            | end              |
            | some event     | 2023-05-21 09:00 | 2023-05-21 12:00 |
        
    Scenario: Updating event
        Given the configuration contains the following events:
            | label          | start            | end              |
            | some event     | 2023-05-21 9:00  | 2023-05-21 12:00 |
            | another event  | 2023-05-21 14:00 | 2023-05-21 16:00 |
        When I open the events list
        And I replace "another event" with "updated event"
        And I select the dates below in "[data-nth-event='2']":
            |      | time  | day | month   | year |
            | from | 15:00 | 22  | April   | 2022 |
            | to   | 17:00 | 20  | January | 2024 |
        Then the value "events[items]" of the '#main' form should equals:
            | label         | start            | end              |
            | some event    | 2023-05-21 09:00 | 2023-05-21 12:00 |
            | updated event | 2022-04-22 15:00 | 2024-01-20 17:00 |

    Scenario Outline: Displaying errors
        Given the configuration contains:
            | name | <form_name> |
        And the configuration contains the following events:
            | label          | start            | end              |
            | some event     | 2023-05-21 9:00  | 2023-05-21 12:00 |
            | another event  | 2023-05-21 14:00 | 2023-05-21 16:00 |
        When I open the events list
        And I replace "some event" with ""
        And I select the dates below in "[data-nth-event='2']":
            |      | time  | day | month   | year |
            | from | 11:00 | 22  | April   | 2024 |
            | to   | 10:00 | 22  | April   | 2024 |
        Then I should see "Label required" in "[data-nth-event='1']"
        And I should see "Invalid date range" in "[data-nth-event='2']"
        And the value "<form_name>[errors]" of the '#main' form should equals:
            | nth-event | message            |
            | 1         | Label required     |
            | 2         | Invalid date range |

        Examples:
            | form_name  |
            | events     |
            | values     |
