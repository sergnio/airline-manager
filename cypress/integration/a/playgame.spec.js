/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

const filePath = "cypress/fixtures/shouldContinueFindingRoutes.txt";

describe("example to-do app", () => {
  const automate = () => {
    cy.visit("https://tycoon.airlines-manager.com/network/planning");

    cy.contains(" Use -").click();
    cy.wait(500);
    // this can be dynamic
    cy.get("span#airport_52").click();
    cy.wait(500);

    // Look in the box that has all aircrafts
    cy.get(".aircraftsBox").each(($el, index, $list) => {
      // within that, find the "boxes" which have 6 aircrafts

      // loop through each of the planes (6 times)
      cy.get("div.aircraftListMiniBox").each(($plane) => {
        // todo - this doesn't work...
        cy.wrap($plane).contains(": 0%").click();

        // now find the routes which have 1195 passengers
        // ** iterate over the routes **
        // loop thru each route
        cy.get("span.lineList").each(($line) => {
          Cypress._savedData.found = false;
          // cy.log("use1195 value:", found1195);
          // if we've found it, just break it out
          if (Cypress._savedData.found === true) {
            cy.log("found this to be true");
            cy.wait(20000);
            return false;
          }

          cy.wrap($line).click();

          const routePAX = "tr#demandDay0 td.greenBonus";
          cy.get(routePAX)
            .first()
            .invoke("text", (_, theText) => {
              // text is formatted like "1190 PAX"
              const paxValue = theText.split(" ")[0];

              if (paxValue >= 1195) {
                // selects the routes for all days and saves it
                cy.get("td#caseIndex0").click();
                cy.log("Great success", paxValue);
                cy.get("img.planningDuplicate").first().click();
                cy.get("input#planningSubmit")
                  .click()
                  .then(() => {
                    cy.log("exiting");
                    cy.exec("exit", { timeout: 1 });
                  });
                return false;
              } else {
                cy.log("not enough pax", paxValue).then(() => {
                  cy.log("setting this to false");
                });
              }
            });
        });
      });
    });
  };

  beforeEach(() => {
    cy.login();
    Cypress._savedData = { found: false };
  });

  /*
  1 - plane 0% use
  2 - choose a route (to see the Pax, must be >= 1190)
  3 - schedule
  */
  it("navigate to the scheduling page", () => {
    automate();
  });
});
