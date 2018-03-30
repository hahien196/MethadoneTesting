/**
 * 
 */
import './common_commands'

Cypress.Commands.add("validateDoNotUpdate", function(url) {
	url.testcases.forEach(testcase =>{
		cy.fillDatas(testcase.inputs);
		
		let arr1 = cy.getValueOfRow(url.pos);
		
		cy.get('input[ng-click = "close()"]').click();
		cy.wait(3000);
		
		let arr2 = cy.getValueOfRow(url.pos);
		
		cy.compare2Arrays(arr1, arr2);
		
	})
})
