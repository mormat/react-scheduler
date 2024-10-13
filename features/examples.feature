@refactor
Feature: Examples

    Background:
        Given today is "2024-10-07" 

    Scenario: Create empty scheduler
        When I open "examples" page
        And I click on "Create empty scheduler"
        Then the scheduler should be in week view

    Scenario: Loading static events
        When I open "examples" page
        And I click on "Loading static events"
        Then I should see :
            | interview       |
            | conference      |
            | meeting         |
            | training course |

    Scenario: Loading ajax events
        # All the events from the ajax request should be displayed in the scheduler
        # and should be loaded from a specific date range
        When I open "examples" page
        And I click on "Loading ajax events"
        And I wait until I see "interview"
        Then I should see :
            | conference      |
            | meeting         |
            | training course |
        And "./examples.json" should be loaded from "2024-10-07 00:00:00.000" to "2024-10-13 23:59:59.999"
        When I click on ">"
        Then "./examples.json" should be loaded from "2024-10-14 00:00:00.000" to "2024-10-20 23:59:59.999"
        When I click on "today"
        Then "./examples.json" should be loaded from "2024-10-07 00:00:00.000" to "2024-10-13 23:59:59.999"
        When I click on "<"
        Then "./examples.json" should be loaded from "2024-09-30 00:00:00.000" to "2024-10-06 23:59:59.999"
        When I click on "today"
        And I click on "day"
        Then "./examples.json" should be loaded from "2024-10-07 00:00:00.000" to "2024-10-07 23:59:59.999"
        When I click on "month"
        Then "./examples.json" should be loaded from "2024-09-30 00:00:00.000" to "2024-11-03 23:59:59.999"

    @drag_and_drop
    Scenario: Drag and drop event
        When I open "examples" page
        And I click on "Drag and drop event"
        When I drag the "moveable" event to "Mon, Oct 7" at "09:00"
        Then the 'moveable' event should be displayed at "Mon, Oct 7" from '09:00' to '12:00'
        When I drag the "fixed position" event to "Wed, Oct 9" at "09:00"
        Then the "fixed position" event should be displayed at "Thu, Oct 10" from '09:00' to '12:00'

    @drag_and_drop
    Scenario: Resize event
        When I open "examples" page
        And I click on "Resize event"
        When I resize the "resizeable" event to "14:00"
        Then the 'resizeable' event should be displayed at "Tue, Oct 8" from '09:00' to '14:00'
        When I resize the "fixed height" event to "14:00"
        Then the "fixed height" event should be displayed at "Thu, Oct 10" from '09:00' to '12:00'

    @crud
    Scenario: Creating event
        When I open "examples" page
        And I click on "Creating event"
        And I click on "Add event"
        And I fill the values below:
            | label | meeting           |
            | start | 10/07/2024 02:00P |
            | end   | 10/07/2024 05:00P |
        And I click on "ok"
        And the 'meeting' event should be displayed at "Mon, Oct 7" from '14:00' to '17:00'

    @crud
    Scenario: Editing event
        When I open "examples" page
        And I click on "Editing and deleting event"
        And I click on the "interview" event
        And I fill the values below:
            | label | meeting           |
            | start | 10/07/2024 02:00P |
            | end   | 10/07/2024 05:00P |
        And I click on "ok"
        And the 'meeting' event should be displayed at "Mon, Oct 7" from '14:00' to '17:00'

    @crud
    Scenario: Deleting event
        When I open "examples" page
        And I click on "Editing and deleting event"
        And I click on the "interview" event
        And I click on "delete"
        Then the "interview" event should not be displayed

