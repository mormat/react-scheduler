Feature: Configuring the scheduler

    Background:
        Given the date today is "2023-05-01" 

    Scenario: Default view mode
        Given the configuration is empty
        When I open the scheduler
        Then the current view should be 'week'

    Scenario: Configuring view mode
        Given the configuration contains:
            | viewMode | month |
        When I open the scheduler
        Then the current view should be 'month'
        
    Scenario: Starting date is today's date by default
        Given the configuration is empty
        When I open the scheduler in "week" view
        Then I should see "May 1, 2023"

    Scenario: Define initial date
        Given the configuration contains:
            | initialDate | 2023-10-08 |
        When I open the scheduler in "week" view
        Then I should see "Oct 8, 2023"

    Scenario: Display hours by default
        Given the configuration is empty
        When I open the scheduler in "week" view
        Then hours from "06:00" to "21:00" should be displayed

    Scenario: Display hours from configuration
        Given the configuration contains:
            | minHour | 08 |
            | maxHour | 20 |
        When I open the scheduler in "week" view
        Then hours from "08:00" to "19:00" should be displayed

    Scenario: i18n
        Given the configuration contains:
            | locale | fr |
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
                    console.log(`'${e.label}' was moved`)
                }
            """
        When I open the scheduler in "week" view
        And I move the "Presentation" event to "2023-05-02" at "10:00"
        Then the logs should contain the info:
            """
                'Presentation' was moved
            """

    # @drag_and_drop
    # Scenario Outline: 'enableOverlapping' property
    #    Given the configuration contains the following events:
    #        | start            | end              | label         |
    #        | 2023-05-01 08:00 | 2023-05-01 09:00 | Meeting       |
    #        | 2023-05-01 11:00 | 2023-05-01 12:00 | Presentation  |
    #    And the configuration contains:
    #        | enableOverlapping | <overlaps_enabled> |
    #    When I open the scheduler in "week" view
    #    And I move the "Meeting" event to "2023-05-01 11:00"
    #    Then I should see "<expected_text>"
    #
    #    Examples:
    #        | overlaps_enabled | expected_text         |
    #        | false            | 08:00 - 09:00 Meeting |
    #        | true             | 11:00 - 12:00 Meeting |
