describe('Search Suggestions', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('shows suggestions when typing in the search box', () => {
    cy.get('input[placeholder="Search movies..."]').type('Star')
    cy.get('.suggestions-container').should('be.visible')
    cy.contains('Star Wars').should('be.visible')
  })

  it('allows selecting a suggestion', () => {
    cy.get('input[placeholder="Search movies..."]').type('Star')
    cy.contains('Star Wars').click()
    cy.get('input[placeholder="Search movies..."]').should('have.value', 'Star Wars')
  })
})
