describe('Movie Search', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('allows users to search for movies', () => {
    cy.get('input[placeholder="Search movies..."]').type('Inception')
    cy.get('button[type="submit"]').click()
    cy.contains('Inception').should('be.visible')
  })

  it('displays movie details when "View Details" is clicked', () => {
    cy.get('input[placeholder="Search movies..."]').type('Inception')
    cy.get('button[type="submit"]').click()
    cy.contains('View Details').first().click()
    cy.contains('IMDb ID:').should('be.visible')
    cy.contains('View on IMDb').should('be.visible')
  })

  it('loads more movies when "Load More" is clicked', () => {
    cy.get('input[placeholder="Search movies..."]').type('Marvel')
    cy.get('button[type="submit"]').click()
    cy.get('.grid > div').should('have.length', 10)
    cy.contains('Load More').click()
    cy.get('.grid > div').should('have.length', 20)
  })
})
