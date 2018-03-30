const updateSuccess = require('../fixtures/Update_success.json');
const updateFail = require('../fixtures/Update_fail.json');
//const updateCancel = require('../fixtures/Update_cancel.json');

const UpdateSuccess = [];
UpdateSuccess.push(updateSuccess);

const UpdateFail = [];
UpdateFail.push(updateFail);

//const UpdateCancel = [];
//UpdateCancel.push(updateCancel);

let isValid = function(variable) {
	return (variable != null && variable != undefined && variable != ""
	|| (typeof variable === "number" && variable != NaN))
};

describe('Updating successfully', function () {
	UpdateSuccess.forEach(page=>{
	   page.users.forEach(user=>{
		   	context('Account: '+ user.email, function(){
				user.urls.forEach(url =>{
					context('Path: '+url.path, function(){
						url.testcases.forEach(testcase =>{
							context('Testcase: '+testcase.casename , function(){
								
								beforeEach(function () {
									// login
									cy.visit("/signin");
									cy.doLogin(user);								
									// go to update form 
									cy.visit(url.path);
								})
								
								it('Validate update successfully', function() {
									
									// Click icon "Sửa"
									cy.clickButton(url);
									
									
									
									// validate update success
									let assert = testcase.assert;
									
									if(assert.data == "input.value"){
										
										
										switch (assert.check){
											case "1": {
												 testcase.inputs.forEach(input => {
													 
													// fill all required data
														cy.fillDatas(testcase.inputs);
													// click btn Lưu
														cy.get('i.fa-save').click();
														
													if(isValid(input.index))
														 cy.get('.table>tbody>:nth-child('+testcase.pos+')>:nth-child('
																 + input.index+')')
														   .should('contain', input.value);
												 });
												 break;
											 }	
											 case "0":
												 cy.validateDoNotUpdate(url);
												 break;
										 }
									}
									else {
										// fill all required data
										cy.fillDatas(testcase.inputs);
										// click btn Lưu
										cy.get('i.fa-save').click();
										cy.validateToastMessage(assert);
									}
										
								})
								
								/* delete record in url.pos row
								afterEach(function(){
									
									cy.deleteByPos(url);
								})
								*/
							})
							
						});
					})
					
				});
			})
		});
   })

})

describe('Updateing fail', function () {
	UpdateFail.forEach(page=>{
	   page.users.forEach(user=>{
			context('Account: '+user.email, function(){
				user.urls.forEach(url =>{
					context('Path: '+url.path, function(){
						url.testcases.forEach(testcase =>{
							context(testcase.casename , function(){
								
								beforeEach(function () {
									// login
									cy.visit("/signin");
									cy.doLogin(user);
									
									// go to create form 
									cy.visit(url.path);
								})
								
								it('Validate display error text when input invalid email/password', function() {
									
									// Click icon "Sửa"
									cy.clickButton(url);

									// fill some data
									cy.fillDatas(url.inputs);
									
									// fill email and password
									cy.fillDatas(testcase.datas);
									
									// Click button "Lưu"
									cy.get('i.fa-save').click();
									
									// validate text when input invalid datas
									cy.validateInvalidText(testcase.assert);
									
								})
							})
						});
					})
				});
			})
		});
   })
})
/*
describe.skip('Cancel updateing', function () {
	UpdateCancel.forEach(page=>{
	   page.users.forEach(user=>{
			context('Account: '+user.email, function(){
				user.testcases.forEach(testcase =>{
					
					context(testcase.casename , function(){
						
						beforeEach(function () {
							// login
							cy.visit("/signin");
							cy.doLogin(user);
							
							// go to create form 
							cy.visit(testcase.path);
						})
						
						it('Validate no record is created', function() {
							
							// Click button "Thêm"
							cy.clickButton(url);
														
							// validate all field is not change
							cy.validateDoNotUpdate(url);
							
							
						})
					})
				});
			})
		});
   })

})
*/