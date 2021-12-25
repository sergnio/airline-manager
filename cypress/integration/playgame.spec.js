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

/**
 *
 * @param {number} planeIndex
 * @param {array} planeList
 * @param {number} routeIndex
 * @param {array} routeList
 */
const findRoute = (planeIndex, planeList, routeIndex, routeList) => {
  cy.wrap(planeList[planeIndex])
    .contains(": 0%")
    .click()
    .then(() => {
      // base case - if we're at the end, break out
      if (planeIndex >= planeList.length) {
        cy.log("exiting");
        cy.exec("exit", { timeout: 1 });
      }

      cy.log("actual route", routeList[routeIndex]);
      cy.get(routeList[routeIndex]).click();

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
                cy.log("clicked submit.. recursing");
                cy.wait(4000);
                findRoute(planeIndex + 1, planeList, 0, routeList);
              });
          } else {
            cy.log("not enough pax.. not recursing", paxValue);
          }
        });
    });
};

describe("example to-do app", () => {
  const automate = () => {
    cy.visit("https://tycoon.airlines-manager.com/network/planning");

    cy.contains(" Use -").click();
    cy.wait(500);
    // this can be dynamic
    cy.get("span#airport_52").click();
    cy.wait(500);

    // Look in the box that has all aircrafts
    cy.get(".aircraftsBox").each((aircraftBox, index, $list) => {
      // within that, find the "boxes" which have 6 aircrafts
      // loop through each of the planes (6 times)
      cy.get("div.aircraftListMiniBox").each(
        ($plane, planeIndex, planeList) => {
          // now find the routes which have 1195 passengers
          // ** iterate over the routes **
          // loop thru each route
          cy.get("span.lineList").each(($route, routeIndex, routeList) => {
            findRoute(planeIndex, planeList, routeIndex, routeList, $route);
          });
        }
      );
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
    automate();
  });
});
