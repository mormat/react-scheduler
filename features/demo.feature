@demo
# The demo page shows all the feature put together and should still work
Feature: Demo page

    Background:
        Given today is "2024-10-14" 

    Scenario: Events should be displayed
        When I open "index" page
        Then I should see :
            | interview |
            | meeting   |
            | training course |

    Scenario: Events should be draggable
        When I open "index" page
        And I drag the "interview" event to "Mon, Oct 14" at "10:00"
        Then the "interview" event should be displayed at "Mon, Oct 14" from "10:00" to "12:00"

    Scenario: Events should be resizable
        When I open "index" page
        And I resize the "interview" event to "14:00"
        Then the "interview" event should be displayed at "Tue, Oct 15" from "10:00" to "14:00"

    @form
    Scenario: User can add event
        When I open "index" page
        And I click on "Add event"
        And I fill the values below:
            | Label | conference        |
            | Start | 10/14/2024 02:00P |
            | End   | 10/14/2024 05:00P |
        And I click on "OK"
        And the 'conference' event should be displayed at "Mon, Oct 14" from '14:00' to '17:00'

    @form 
    Scenario: User can edit event
        When I open "index" page
        And I click on the "interview" event
        And I fill the values below:
            | Label | conference        |
            | Start | 10/14/2024 02:00P |
            | End   | 10/14/2024 05:00P |
        And I click on "OK"
        And the 'conference' event should be displayed at "Mon, Oct 14" from '14:00' to '17:00'

    @form @todo
    Scenario: User can delete event
        When I open "index" page
        And I click on the "interview" event
        And I click on "Delete"
        Then the "interview" event should not be displayed

