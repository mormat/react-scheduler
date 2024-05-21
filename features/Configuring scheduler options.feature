@config
Feature: Configuring the scheduler

    Background:
        Given the date today is "2023-05-01" 

    Scenario: Default view mode
        Given the configuration is empty
        When I open the scheduler
        Then the current view should be 'week'

    Scenario: Configuring view mode
        Given the configuration contains:
            | viewMode | 'month' |
        When I open the scheduler
        Then the current view should be 'month'
        
    Scenario: Starting date is today's date by default
        Given the configuration is empty
        When I open the scheduler in "week" view
        Then I should see "May 1, 2023"

    Scenario Outline: Define initial date
        Given the configuration contains:
            | initialDate | <value> |
        When I open the scheduler in "week" view
        Then I should see "<expected_text>"

    Examples:
        | value        | expected_text |
        | '2023-10-08' | Oct 8, 2023   |
        | null         | May 1, 2023   |

    Scenario: Display hours by default
        Given the configuration is empty
        When I open the scheduler in "week" view
        Then hours from "06:00" to "21:00" should be displayed

    Scenario: Display hours from configuration
        Given the configuration contains:
            | minHour | '08' |
            | maxHour | '20' |
        When I open the scheduler in "week" view
        Then hours from "08:00" to "19:00" should be displayed

    Scenario: i18n
        Given the configuration contains:
            | locale | 'fr' |
        When I open the scheduler in "week" view
        Then I should see "lun. 1 mai"

    @drag_and_drop
    Scenario: 'onEventUpdate' event
        Given the configuration contains the following events:
            | start            | end              | label           |
            | 2023-05-01 10:00 | 2023-05-01 12:00 | Presentation    |
        And "onEventUpdate" in configuration equals:
            """
                function(e) {
                    notify(`'${e.label}' was moved`)
                }
            """
        When I open the scheduler in "week" view
        And I move the "Presentation" event to "2023-05-02" at "10:00"
        Then I should see "'Presentation' was moved" in notifications
    
    @crud
    Scenario Outline: enable or disable create/update events
        Given the configuration contains:
            | editable | <value> |
        And the date today is "2023-05-01"
        And the configuration contains the following events:
            | start            | end              | label         |
            | 2023-05-01 10:00 | 2023-05-01 12:00 | Presentation  |
            | 2023-05-01 10:00 | 2023-05-02 12:00 | Training      |
        When I open the scheduler in "<view_mode>" view
        Then I should <see_or_not> the element "[title='Add event']"
        And I should <see_or_not> the element "[title='Edit event']" in "Presentation" event
        And I should <see_or_not> the element "[title='Edit event']" in "Training" event

        Examples:
            | value     | view_mode | see_or_not |
            | true      | week      | see        |
            | false     | week      | not see    |
            | true      | month     | see        |
            | false     | month     | not see    |

    @drag_and_drop
    Scenario Outline: enable/disable drag and drop
        Given the configuration contains: 
            | draggable | <value> |
        And the date today is "2023-05-01"
        And the configuration contains the following events:
            | start            | end              | label         |
            | 2023-05-01 10:00 | 2023-05-01 12:00 | Presentation  |
            | 2023-05-01 10:00 | 2023-05-02 12:00 | Training      |
        When I open the scheduler in "<view_mode>" view
        And I move the "<event_name>" event to <target>
        Then I should <see_or_not> the "<event_name>" event in <target>

        Examples:
            | value | see_or_not | view_mode | event_name   | target                  |
            | true  | see        | week      | Presentation | "2023-05-01" at "16:00" | 
            | false | not see    | week      | Presentation | "2023-05-01" at "16:00" | 
            | true  | see        | month     | Presentation | "2023-05-02"            | 
            | false | not see    | month     | Presentation | "2023-05-02"            |
            | true  | see        | month     | Training     | "2023-05-02"            |
            | false | not see    | month     | Training     | "2023-05-02"            |

    Scenario: Configure displayed text
        Given "labels" in configuration contains the values below:
            | header.today | Aujourd'hui |
            | header.day   | Jour        |
            | header.month | Mois        |
            | header.week  | Semaine     |
        When I open the scheduler
        Then I should see "<AUJOURD'HUI>"
        And I should see "JOURSEMAINEMOIS"

    Scenario: Displayed text with default configuration
        Given "labels" in configuration is undefined
        When I open the scheduler
        Then I should see "<TODAY>"
        And I should see "DAYWEEKMONTH"