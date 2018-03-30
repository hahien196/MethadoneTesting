const addSuccess = require("../fixtures/Update_success.json");
const addFail = require("../fixtures/Update_fail.json");
const addCancel = require("../fixtures/Add_cancel.json");

const AddSuccess = [];
AddSuccess.push(addSuccess);

const AddFail = [];
AddFail.push(addFail);

const AddCancel = [];
AddCancel.push(addCancel);

let isValid = function(variable) {
	return (variable != null && variable != undefined && variable != ""
	|| (typeof variable === "number" && variable != NaN))
};

describe.skip('Adding successfully', function () {
	AddSuccess.forEach(page=>{
	   page.users.forEach(user=>{
		   	context('Account: '+ user.email, function(){
				user.urls.forEach(url =>{
					
					context('Path: '+ url.path, function(){
						url.testcases.forEach(testcase =>{
							context('Testcase: '+ testcase.casename , function(){
								
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
									
									// fill all required data
									cy.fillDatas(testcase.inputs);
									
									// validate update success
									let assert = testcase.assert;
									if(assert.data == "input.value"){
										cy.validateInputField(testcase);
									}
									else {
										// click btn Lưu
										cy.get('i.fa-save').click();
										
										switch (assert.check){
											case "1": {
												 testcase.inputs.forEach(input => {
													if(isValid(input.index))
														 cy.get('.table>tbody>:nth-child('+testcase.pos+')>:nth-child('
																 + input.index+')')
														   .should('contain', input.value);
												 });
												 break;
											 }	
											 case "0":
												 cy.validateToastMessage(assert);
												 break;
										 }
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

describe('Adding fail', function () {
	AddFail.forEach(page=>{
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

describe.skip('Cancel adding', function () {
	AddCancel.forEach(page=>{
	   page.users.forEach(user=>{
			context('Account: '+user.email, function(){
				user.testcases.forEach(testcase =>{
					context(testcase.casename+'_'+testcase.path , function(){
						
						beforeEach(function () {
							// login
							cy.visit("/signin");
							cy.doLogin(user);
							
							// go to create form 
							cy.visit(testcase.path);
						})
						
						it('Validate no record is created', function() {
							
							// Click button "Thêm"
							cy.clickButton(testcase);
							
							// fill all required datas
							cy.fillDatas(testcase.inputs);
							
							// Click button "Đóng"
							cy.get('input[ng-click = "close()"]').click();
							
							// validate record is not created
							let flag = cy.validateAValueNotExist(testcase.inputs);
							cy.expect(flag).to.be.true;
							
						})
					})
				});
			})
		});
   })

})