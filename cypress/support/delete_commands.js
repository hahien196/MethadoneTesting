/**
 * 
 */


Cypress.Commands.add("doLogin", function(user) {
	if (user.email != undefined && user.email != "")
		cy.get('input[name="email"]').type(user.email);
	if (user.password != undefined && user.password != "")
		cy.get('input[name="password"]').type(user.password + '{enter}')
	  
	cy.url().should('not.include', '/signin')
})
