@standalone
Feature: Standalone version

    Scenario Outline: rendering the scheduler
        When I open the standalone version with the script below:
        """
            mormat_standalone_scheduler.renderScheduler(<element>);
        """
        Then I should see "TODAY"

        Examples:
            | element                         |
            | document.getElementById('main') |
            | '#main'                         |

    Scenario: rendering the scheduler with props 
        When I open the standalone version with the script below:
        """
            mormat_standalone_scheduler.renderScheduler('#main', { initialDate: '2022-01-03'} );
        """
        Then I should see "Jan 3, 2022"

