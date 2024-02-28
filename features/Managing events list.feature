@admin
Feature: Managing events list

    Background:
        Given the configuration contains:
            | targetElement | document.getElementById('comments')         |

    Scenario: Displaying empty list
        When I open the events list
        Then "#comments" should contain:
            | label          | start            | end              | errors |

    Scenario: Displaying list with events
        # @todo check that field values are set
        When I open the events list with "#comments" containing:
            | label          | start            | end              |
            | some event     | 2023-05-21 9:00  | 2023-05-21 12:00 |
            | another event  | 2023-05-21 14:00 | 2023-05-21 16:00 |
        Then "#comments" should contain:
            | label          | start            | end              | errors |
            | some event     | 2023-05-21 09:00 | 2023-05-21 12:00 |        |
            | another event  | 2023-05-21 14:00 | 2023-05-21 16:00 |        |

    Scenario: Adding event
        Given the date today is "2023-05-01 10:00" 
        When I open the events list
        And I click on "Add event"
        Then "#comments" should contain:
            | label  | start            | end              | errors         |
            |        | 2023-05-01 10:00 | 2023-05-01 11:00 | Label required |

    Scenario: Deleting event
        When I open the events list with "#comments" containing:
            | label          | start            | end              |
            | some event     | 2023-05-21 9:00  | 2023-05-21 12:00 |
            | another event  | 2023-05-21 14:00 | 2023-05-21 16:00 |
        And I click on "delete" in "[data-nth-event='2']"
        Then "#comments" should contain:
            | label          | start            | end              | errors |
            | some event     | 2023-05-21 09:00 | 2023-05-21 12:00 |        |
        
    Scenario: Updating event
        When I open the events list with "#comments" containing:
            | label          | start            | end              |
            | some event     | 2023-05-21 9:00  | 2023-05-21 12:00 |
            | another event  | 2023-05-21 14:00 | 2023-05-21 16:00 |
        And I replace "another event" with "updated event"
        And I select the dates below in "[data-nth-event='2']":
            |      | time  | day | month   | year |
            | from | 15:00 | 22  | April   | 2022 |
            | to   | 17:00 | 20  | January | 2024 |
        Then "#comments" should contain:
            | label         | start            | end              | errors |
            | some event    | 2023-05-21 09:00 | 2023-05-21 12:00 |        |
            | updated event | 2022-04-22 15:00 | 2024-01-20 17:00 |        |

    Scenario: Displaying errors
        When I open the events list with "#comments" containing:
            | label          | start            | end              |
            | some event     | 2023-05-21 9:00  | 2023-05-21 12:00 |
            | another event  | 2023-05-21 14:00 | 2023-05-21 16:00 |
        And I replace "some event" with ""
        And I select the dates below in "[data-nth-event='2']":
            |      | time  | day | month   | year |
            | from | 11:00 | 22  | April   | 2024 |
            | to   | 10:00 | 22  | April   | 2024 |
        Then I should see "Label required" in "[data-nth-event='1']"
        And I should see "Invalid date range" in "[data-nth-event='2']"
        And "#comments" should contain:
            | label         | start            | end              | errors             |
            |               | 2023-05-21 09:00 | 2023-05-21 12:00 | Label required     |
            | another event | 2024-04-22 11:00 | 2024-04-22 10:00 | Invalid date range |
