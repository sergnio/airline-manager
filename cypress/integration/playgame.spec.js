/// <reference types="cypress" />

const filePath = "cypress/fixtures/shouldContinueFindingRoutes.txt";

/**
 *
 * @param {number} planeIndex
 * @param {array} planeList
 * @param {number} routeIndex
 * @param {array} routeList
 */
const findRoute = (planeIndex, planeList) => {
  cy.wrap(planeList[planeIndex])
    .contains(": 0%")
    .click({ force: true })
    .then(() => {
      // base case - if we're at the end, break out
      if (planeIndex >= planeList.length) {
        cy.log("exiting");
        return;
      }

      cy.get("span.lineList").each(($route) => {
        cy.wrap($route).click();

        const routePAX = "tr#demandDay0 td.greenBonus";
        cy.get(routePAX)
          .first()
          .invoke("text", (_, theText) => {
            // text is formatted like "1190 PAX"
            const paxValue = theText.split(" ")[0];

            if (paxValue >= Cypress.env("paxMinimum")) {
              // selects the routes for all days and saves it
              cy.get("td#caseIndex0").click();
              cy.log("Great success", paxValue);
              cy.get("img.planningDuplicate").first().click();
              cy.get("input#planningSubmit")
                .click()
                .then(() => {
                  cy.log("clicked submit.. recursing");
                  findRoute(planeIndex + 1, planeList);
                });
            } else {
              cy.log("not enough pax.. not recursing", paxValue);
            }
          });
      });
    });
};

describe("example to-do app", () => {
  const automate = () => {
    cy.visit("https://tycoon.airlines-manager.com/network/planning");

    cy.contains(" Use -").click();
    cy.wait(500);
    // this can be dynamic
    cy.get(`span#${Cypress.env("airportHub")}`).click();
    cy.wait(1000);

    // loop through each of the planes (6 times)
    cy.get("div.aircraftListMiniBox").each(($plane, planeIndex, planeList) => {
      // now find the routes which have 1195 passengers
      // ** iterate over the routes **
      // loop thru each route
      findRoute(planeIndex, planeList);
    });
  };

  beforeEach(() => {
    cy.login();
  });

  /*
  1 - plane 0% use
  2 - choose a route (to see the Pax, must be >= 1190)
  3 - schedule
  */
  it("navigate to the scheduling page", () => {
    automate()
  });
});
