@admin
Feature: Admin section

    Scenario Outline: Displaying <name> with '<value>'
        Given the '#main' form contains:
            | <name> | <value> |
        When I open the admin section
        Then I should see "<expected>" in the '#main' form

    Examples:
        | name        | value      | expected                                |
        | initialDate |            | Initial date [ ]                        |
        | initialDate | 2023-01-21 | Initial date [X] 21 January 2023        |
        | initialView | day        | Initial view (X) day ( ) week ( ) month |
        | initialView | week       | Initial view ( ) day (X) week ( ) month |
        | initialView | month      | Initial view ( ) day ( ) week (X) month |

    Scenario Outline: Set prefix in form name
        Given the '#main' form contains:
            | mormat_scheduler_initialDate | 2023-01-21 |
            | mormat_scheduler_initialView | day        |
        And 'mormat_scheduler_events' in the '#main' form equal:
            | label          | start            | end              | bgColor |
            | some event     | 2023-05-21 10:00 | 2023-05-21 12:00 | #0288d1 |
        When I open the admin section with the props below:
            | namePrefix | 'mormat_scheduler_' |
        Then I should see all items below in the '#main' form:
            | Initial date [X] 21 January 2023 |
            | Initial view (X) day             |
            | some event                       |
        And the "#main" form should contain:
            | mormat_scheduler_initialDate | 2023-01-21 |
            | mormat_scheduler_initialView | day        |
        Then 'mormat_scheduler_events' in the '#main' form should contain:
            | label      | start            | end              | bgColor |
            | some event | 2023-05-21 10:00 | 2023-05-21 12:00 | #0288d1 |

    Scenario: Updating settings should refresh form values
        When I open the admin section
        And I enable "Initial date" with "10 August 2023"
        Then the "#main" form should contain:
            | initialDate | 2023-08-10 |

    Scenario: experiment 3
        When I open the admin section
        And I disable "Initial date"
        Then the "#main" form should not contain any 'initialDate'
        
    Scenario: experiment 5
        When I open the admin section
        And I set 'Initial view' with "week"
        Then the "#main" form should contain:
            | initialView | week |

    Scenario: Displaying events
        Given 'events' in the '#main' form equal:
            | label          | start            | end              | bgColor |
            | some event     | 2023-05-21 9:00  | 2023-05-21 12:00 | #0288d1 |
        When I open the admin section
        Then I should see all items below in the '#main [data-nth-event="1"]' form:
            | some event             |
            | from 09:00 21 May 2023 |
            | to 12:00 21 May 2023   |
            | (X) #0288d1            |

    Scenario: Adding and editing events
        When I open the admin section
        And I add an event with:
            | label | foo                  |
            | from  | 10:00 11 August 2021 |
            | to    | 15:00 12 August 2022 |
        And I add an event with:
            | label | bar                 |
            | from  | 11:00 20 April 2023 |
            | to    | 12:00 20 April 2023 |
        And I edit the "foo" event with:
            | label | foo2                 |
            | from  | 12:00 12 August 2022 |
            | to    | 18:00 13 August 2022 |
        Then 'events' in the '#main' form should contain:
            | label | start            | end              |
            | foo2  | 2022-08-12 12:00 | 2022-08-13 18:00 |
            | bar   | 2023-04-20 11:00 | 2023-04-20 12:00 |

    Scenario: Editing events
        Given 'events' in the '#main' form equal:
            | label   | start            | end              |
            | foo     | 2022-08-12 12:00 | 2022-08-13 18:00 |
            | bar     | 2023-04-21 9:00  | 2023-04-21 12:00 |
        When I open the admin section
        And I edit the "bar" event with:
            | label | bar2                 |
            | from  | 10:00 14 August 2023 |
            | to    | 12:00 14 August 2023 |
        Then 'events' in the '#main' form should contain:
            | label | start            | end              |
            | foo   | 2022-08-12 12:00 | 2022-08-13 18:00 |
            | bar2  | 2023-08-14 10:00 | 2023-08-14 12:00 |

    Scenario: Removing event
        Given 'events' in the '#main' form equal:
            | label      | start            | end              | bgColor |
            | Conference | 2023-05-21 9:00  | 2023-05-21 12:00 | #0288d1 |
        When I open the admin section
        And I remove the "Conference" event
        Then I should not see "Conference" in the "#main" form

    Scenario: Label required
        Given 'events' in the '#main' form equal:
            | label      | start            | end              | bgColor |
            | Conference | 2023-05-21 9:00  | 2023-05-21 12:00 | #0288d1 |
        When I open the admin section
        And I edit the "Conference" event with:
            | label |  |
        Then I should see "Label required" in the '#main [data-nth-event="1"]' form
        And 'events' in the '#main' form should contain:
            | label | errors         |
            |       | Label required |

    @experiment
    Scenario: Invalid date range
        Given 'events' in the '#main' form equal:
            | label      | start            | end              |
            | Conference | 2023-05-21 9:00  | 2023-05-21 12:00 |
        When I open the admin section
        And I edit the "Conference" event with:
            | from | 18:00 21 May 2023  |
        Then I should see "Invalid date range" in the '#main [data-nth-event="1"]' form
        And 'events' in the '#main' form should contain:
            | label      | errors             |
            | Conference | Invalid date range |
