const deleteSuccess = require("../fixtures/Del_success.json");
const deleteCancel = require("../fixtures/Del_cancel.json");

const DeleteSuccess = [];
DeleteSuccess.push(deleteSuccess);

const DeleteCancel = [];
DeleteCancel.push(deleteCancel);

describe('Deleteing successfully', function () {
	DeleteSuccess.forEach(page=>{
	   page.users.forEach(user=>{
		   	context('Account: '+ user.email, function(){
				user.urls.forEach(url =>{
					
					context('Path: '+ url.path, function(){
						url.testcases.forEach(testcase =>{
							context(testcase.casename , function(){
								
								beforeEach(function () {
									// login
									cy.visit("/signin");
									cy.doLogin(user);								
									// go to create form 
									cy.visit(url.path);
								})
								
								it('Validate delete successfully', function() {
									
									
									// Click button "Thêm"
									cy.clickButton(url);
										
									// fill all required data
									cy.fillDatas(testcase.inputs);
									
									// validate delete success
									let assert = testcase.assert;
									if(assert.data == "input.value"){
										cy.validateInputField(testcase);
									}
									else {
										// click btn Lưu
										cy.get('i.fa-save').click();
										
										switch (assert.check){
											 case "1": 
												 if(url.pos == "first")
													cy.validateDeleteFirst(testcase.inputs);
												 else 
													cy.validateDeleteLast(testcase.inputs);
												 break;
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


describe.skip('Cancel deleteing', function () {
	DeleteCancel.forEach(page=>{
	   page.users.forEach(user=>{
			context(user.email, function(){
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