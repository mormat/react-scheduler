@example
Feature: Examples

    Background:
        Given today is "2024-10-07 10:12" 

    Scenario: Create empty scheduler
        When I open the "Create empty scheduler" example
        Then the scheduler should be in week view
        And the scheduler header should contains:
            | TODAY                      |
            | Oct 7, 2024 - Oct 13, 2024 |
            | DAY WEEK MONTH             |

    Scenario: Loading static events
        When I open the "Loading static events" example
        Then I should see :
            | interview       |
            | conference      |
            | meeting         |
            | training course |

    Scenario: Loading ajax events
        # All the events from the ajax request should be displayed in the scheduler
        # and should be loaded from a specific date range
        When I open the "Loading ajax events" example
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
        When I click on "year"
        Then "./examples.json" should be loaded from "2024-01-01 00:00:00.000" to "2024-12-31 23:59:59.999"

    @drag_and_drop
    Scenario: Drag and drop event
        When I open the "Drag and drop event" example
        When I drag the "moveable" event to "Mon, Oct 7" at "09:00"
        Then the 'moveable' event should be displayed at "Mon, Oct 7" from '09:00' to '12:00'

    @drag_and_drop
    Scenario: Resize event
        When I open the "Resize event" example
        And I resize the "resizeable" event to "14:00"
        Then the 'resizeable' event should be displayed at "Tue, Oct 8" from '09:00' to '14:00'

    @i18n
    Scenario: i18n in scheduler
        When I open the "i18n" example
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
        
    @i18n
    Scenario: i18n of buttons for creating and editing events
        When I open the "i18n" example
        Then I should see a "Ajouter un evenement" tooltip
        And  I should see a "Modifier l'evenement" tooltip

    @i18n
    Scenario: i18n in create/edit form
        When I open the "i18n" example
        And I click on "Ajouter un evenement"
        Then I should see :
            | Nom de l'evenement   |
            | A partir de          |
            | Jusqu'a              |
            | Couleur              |
            | Confirmer            |
        And I should see "octobre" in the "A partir de" field of the event form
        And I should see "octobre" in the "Jusqu'a" field of the event form

    @i18n
    Scenario: i18n in ok/cancel dialog
        When I open the "i18n" example
        And I edit the "interview" event
        And I click on "Supprimer"
        Then I should see :
            | Confirmer                           |
            | Annuler                             |
            | Supprimer l'evenement 'interview' ? |

    @create @form
    Scenario: Creating event
        When I open the "Managing events" example
        And I create an event with:
            | Description | meeting |
            | From        | 14:00 7 October 2024 |
            | To          | 17:00 7 October 2024 |
        Then the 'meeting' event should be displayed at "Mon, Oct 7" from '14:00' to '17:00'

    @create @form
    Scenario: Default form values when creating an event
        When I open the "Managing events" example
        And I click on "Add event"
        Then the event form should contains:
            | Description |                      |
            | From        | 10:15 7 October 2024 |
            | To          | 11:15 7 October 2024 |
            | Color       | #0288d1              |

    @form
    Scenario: Description required when creating event (@todo also check i18 error message)
        When I open the "Managing events" example
        And I create an event with:
            | Description | |
        Then I should see "description required"

    @form @todo
    Scenario: Date range should be valid when creating event (@todo also check i18 error message)
        When I open the "Managing events" example
        And I create an event with:
            | Description | meeting |
            | From        | 17:00 7 October 2024 |
            | To          | 14:00 7 October 2024 |
        Then I should see "invalid date range"

    @form @delete
    Scenario: Delete button not visible when creating event
        When I open the "Managing events" example
        And I click on "Add event"
        Then I should not see "delete" (case insensitive)

    @form @edit
    Scenario: Editing event
        When I open the "Managing events" example
        And I update the "interview" event with:
            | Description | other task |
            | From        | 14:00 8 October 2024 |
            | To          | 17:00 8 October 2024 |
        And the 'other task' event should be displayed at "Tue, Oct 8" from '14:00' to '17:00'
        And the "interview" event should not be displayed

    @form @edit
    Scenario: Default form values when editing an event
        When I open the "Managing events" example
        And I edit the "interview" event
        Then the event form should contains:
            | Description | interview            |
            | From        | 10:00 8 October 2024 |
            | To          | 12:00 8 October 2024 |
            | Color       | #0288d1              |

    @form @delete
    Scenario: Deleting event
        When I open the "Listening events change" example
        And I delete the "interview" event
        Then the "interview" event should not be displayed

    @form @create
    Scenario: Listening created event
        When I open the "Listening events change" example
        And I create an event with:
            | Description | meeting |
            | From        | 14:00 7 October 2024 |
            | To          | 17:00 7 October 2024 |
        Then I should see :
            | {"label":"meeting","start":"2024-10-07 14:00","end":"2024-10-07 17:00","bgColor":"#0288d1"} created |

    @form @edit
    Scenario: Listening edited event
        When I open the "Listening events change" example
        And I update the "interview" event with:
            | Description | other task |
            | From        | 14:00 8 October 2024 |
            | To          | 17:00 8 October 2024 |
        Then I should see :
            | {"some_id":1234,"label":"other task","start":"2024-10-08 14:00","end":"2024-10-08 17:00","bgColor":"#0288d1"} updated |
        
    @form @delete
    Scenario: Listening deleted event
        When I open the "Listening events change" example
        And I delete the "interview" event
        Then I should see :
            | {"some_id":1234,"label":"interview","start":"2024-10-08 10:00","end":"2024-10-08 12:00","bgColor":"#0288d1"} deleted |

    @drag_and_drop
    Scenario: Listening dropped event
        When I open the "Listening events change" example
        And I drag the "interview" event to "Mon, Oct 7" at "10:00"
        # @todo the drag behavior above seems to work only with different day and same hour
        Then I should see :
            | {"some_id":1234,"label":"interview","start":"2024-10-07 10:00","end":"2024-10-07 12:00","bgColor":"#0288d1"} dropped |

    @drag_and_drop
    Scenario: Listening resized event
        When I open the "Listening events change" example
        And I resize the "interview" event to "16:00"
        Then I should see :
            | {"some_id":1234,"label":"interview","start":"2024-10-08 10:00","end":"2024-10-08 16:00","bgColor":"#0288d1"} resized |
        
    Scenario: Custom default view
        When I open the "Custom default view" example
        Then "month" should be checked
        And I should see "October 2024"

    @wip
    Scenario: Custom default view
        When I open the "Custom initial date" example
        Then I should see "Jan 5, 2020"

    @create
    Rule: When setting an new id to a freshly created event, this id should be persisted in the lifecycle of the event
        Background:
            When I open the "Setting id for new event" example
            And I create an event with:
                | Description | new task |
                | From        | 14:00 7 October 2024 |
                | To          | 17:00 7 October 2024 |

        @form @edit @wtf
        Example: Updating the freshly created event
            When I edit the "new task" event
            And I click on "ok"
            Then I should see "Event #1234 updated"      

        @form @delete
        Example: Deleting the freshly created event
            When I delete the "new task" event
            Then I should see "Event #1234 deleted"

        @drag_and_drop
        Example: Dragging the freshly created event
            When I drag the "new task" event to "Wed, Oct 9" at "14:00"
            Then I should see "Event #1234 dropped"

        @@drag_and_drop
        Example: Resizing the freshly created event
            When I resize the "new task" event to "18:00"
            Then I should see "Event #1234 resized"

    Rule: Reverting changed event
        Background:
            When I open the "Reverting events change" example
            
        @form @edit
        Example: Reverting edited event
            When I update the "fixed task" event with:
                | Description | updated task |
                | From        | 14:00 8 October 2024 |
                | To          | 17:00 8 October 2024 |
            Then the "updated task" event should not be displayed
            And the 'fixed task' event should be displayed at "Tue, Oct 8" from '10:00' to '12:00'

        @form @delete
        Example: Reverting deleted event
            When I delete the "fixed task" event
            Then the 'fixed task' event should be displayed at "Tue, Oct 8" from '10:00' to '12:00'

        @drag_and_drop
        Example: Reverting dragged event
            When I drag the "fixed task" event to "Mon, Oct 7" at "10:00"
            Then the 'fixed task' event should be displayed at "Tue, Oct 8" from '10:00' to '12:00'

        @@drag_and_drop
        Example: Resizing dragged event
            When I resize the "fixed task" event to "18:00"
            Then the 'fixed task' event should be displayed at "Tue, Oct 8" from '10:00' to '12:00'


