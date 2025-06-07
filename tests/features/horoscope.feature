Feature: Horoscope Website Functionality
  As a user
  I want to enter my details and get my horoscope for each month
  So that I can see what the future holds for me

  Background: User is on the main page
    Given I am on the horoscope website's main page

  Scenario: Submitting personal details
    When I fill in "John" for "First Name"
    And I fill in "Doe" for "Surname"
    And I enter a valid date of birth
    And I click the "Submit" button
    Then I should be taken to the horoscope selection page for "John"
    And I should see 12 cards for each month of the year

  Scenario Outline: Clicking a month reveals the horoscope
    Given I have submitted my details and am on the horoscope page
    When I click on the card for "<Month>"
    Then I should see my horoscope for "<Month>"

    Examples:
      | Month     |
      | January   |
      | April     |
      | July      |
      | October   |
      | December  |

