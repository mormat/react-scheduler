@standalone
Feature: Timel

    Background:
        Given the date today is "2024-04-16 10:00" 
        And the configuration contains:
            | timelined | true |

    @current
    Scenario: rendering the scheduler in "week" view
        # When I open the scheduler in "week" view
        # Then I should see "Apr 15, 2024 - Apr 21, 2024"
        # And I should see "15 16 17 18 19 20 21"

