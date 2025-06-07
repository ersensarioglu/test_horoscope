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
    And I should close the horoscope result
    And I should see 12 cards for each month of the year

    Examples:
      | Month     |
      | January   |
      | April     |
      | July      |
      | October   |
      | December  |

  Scenario: Clicking all monts reveals all horoscopes
    Given I have submitted my details and am on the horoscope page
    When I click on the card for "January"
    Then I should see my horoscope for "January"
    And I should close the horoscope result
    And I should see 12 cards for each month of the year
    When I click on the card for "April"
    Then I should see my horoscope for "April"
    And I should close the horoscope result
    And I should see 12 cards for each month of the year
    When I click on the card for "July"
    Then I should see my horoscope for "July"
    And I should close the horoscope result
    And I should see 12 cards for each month of the year
    When I click on the card for "October"
    Then I should see my horoscope for "October"
    And I should close the horoscope result
    And I should see 12 cards for each month of the year
    When I click on the card for "December"
    Then I should see my horoscope for "December"
    And I should close the horoscope result
    And I should see 12 cards for each month of the year
    When I click on the card for "August"
    Then I should see my horoscope for "August"
    And I should close the horoscope result
    And I should see 12 cards for each month of the year
    When I click on the card for "February"
    Then I should see my horoscope for "February"
    And I should close the horoscope result
    And I should see 12 cards for each month of the year
    When I click on the card for "May"
    Then I should see my horoscope for "May"
    And I should close the horoscope result
    And I should see 12 cards for each month of the year
    When I click on the card for "November"
    Then I should see my horoscope for "November"
    And I should close the horoscope result
    And I should see 12 cards for each month of the year
    When I click on the card for "September"
    Then I should see my horoscope for "September"
    And I should close the horoscope result
    And I should see 12 cards for each month of the year
    When I click on the card for "June"
    Then I should see my horoscope for "June"
    And I should close the horoscope result
    And I should see 12 cards for each month of the year
    When I click on the card for "March"
    Then I should see my horoscope for "March"
    And I should close the horoscope result
    And I should see 12 cards for each month of the year


