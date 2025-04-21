@refactor
Feature: Examples

    Background:
        Given today is "2024-10-07" 

    Scenario: Create empty scheduler
        When I open "examples" page
        And I click on "Create empty scheduler"
        Then the scheduler should be in week view
        And the scheduler header should contains:
            | TODAY                      |
            | Oct 7, 2024 - Oct 13, 2024 |
            | DAY WEEK MONTH             |

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

    @form
    Scenario: Creating event
        When I open "examples" page
        And I click on "Creating event"
        And I click on "Add event"
        And I fill the values below:
            | label | meeting          |
            | start | 07/10/2024 14:00 |
            | end   | 07/10/2024 17:00 |
        And I click on "ok"
        And the 'meeting' event should be displayed at "Mon, Oct 7" from '14:00' to '17:00'

    @form
    Scenario: Editing event
        When I open "examples" page
        And I click on "Editing event"
        And I click on the "interview" event
        And I fill the values below:
            | label | meeting          |
            | start | 07/10/2024 14:00 |
            | end   | 07/10/2024 17:00 |
        And I click on "ok"
        And the 'meeting' event should be displayed at "Mon, Oct 7" from '14:00' to '17:00'

    @form
    Scenario: Deleting event
        When I open "examples" page
        And I click on "Deleting event"
        And I click on the "interview" event
        And I click on "Ok"
        Then the "interview" event should not be displayed

    Scenario: i18n
        When I open "examples" page
        And I click on "i18n"
        Then the scheduler header should contains:
            | AUJOURD'HUI                |
            | 7 oct. 2024 - 13 oct. 2024 |
            | JOUR SEMAINE MOIS          |
        And I should see :
            | lun. 7 oct.  |
            | mar. 8 oct.  | 
            | mer. 9 oct.  |  
            | jeu. 10 oct. |
            | ven. 11 oct. |
            | sam. 12 oct. |
            | dim. 13 oct. |
        When I click on "mois"
        Then I should see "octobre 2024"
        And I should see "lun. mar. mer. jeu. ven. sam. dim."
        
