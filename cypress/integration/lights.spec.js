describe('Testing the light list page', function() {

  it('should contain lights', function() {
    cy.visit('http://localhost:4200/lights');
    cy.contains("Lights");
  })

});
