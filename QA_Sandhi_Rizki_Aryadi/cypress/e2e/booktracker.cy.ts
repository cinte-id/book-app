describe('BookTracker Automated Test Suite', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:8080/')
  })

  it('TC-01: Memastikan navigasi ke halaman Library berjalan lancar', () => {
    cy.contains('Library').click()
    cy.contains('My Books').should('be.visible') 
    cy.contains('Browse').should('be.visible')
  })

  it('TC-02: Memastikan fitur pencarian buku spesifik (1984) di tab Browse Library', () => {
    cy.contains('Library').click()
    cy.contains('Browse').click()
    
    cy.get('input').type('1984')
    
    cy.get('input').should('have.value', '1984')
    cy.contains('George Orwell').should('be.visible') 
  })

  it('TC-03: Memastikan field Search di halaman Discover dapat menerima input teks', () => {
    cy.contains('Discover').click()
    
    cy.get('input').type('Dune')
    
    cy.get('input').should('have.value', 'Dune')
  })
it('TC-04: [BUG CAPTURE] Memastikan halaman notifikasi muncul saat button diklik', () => {
    cy.get('svg').last().click({ force: true })
    
    cy.contains('Notifications').should('be.visible')
  })
})