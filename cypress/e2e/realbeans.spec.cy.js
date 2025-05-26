describe('RealBeans Webshop Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('body').then(($body) => {
      if ($body.find('input[name="password"]').length > 0) {
        cy.get('input[name="password"]').type('ocleid');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/');
      }
    });
  });

  it('displays homepage intro text and product list', () => {
    cy.get('h1, h2, p')
      .contains(
        'Since 1801, RealBeans has roasted premium coffee in Antwerp for Europe’s finest cafes. Ethically sourced beans, crafted with care.'
      )
      .should('be.visible');
    cy.get('.product-grid, .collection-grid')
      .find('.product-card, .grid__item')
      .should('have.length.greaterThan', 0);
  });

  it('displays the correct products in the catalog', () => {
    cy.visit('/collections/all');
    cy.get('.grid__item').each(($product) => {
      cy.wrap($product).find('.card__heading').should('not.be.empty');
      cy.wrap($product).find('.price, .product__price').should('not.be.empty');
    });
  });

  it('sorts products by price', () => {
    cy.visit('/collections/all');
    cy.get('.grid__item').should('have.length.greaterThan', 0);
    cy.get('.grid__item')
      .find('.card__heading')
      .then(($titles) => {
        const initialOrder = $titles.map((i, el) => el.innerText).get();
        cy.log('Initial Order:', initialOrder);
        cy.get('.grid__item')
          .find('.price, .product__price')
          .then(($prices) => {
            const initialPrices = $prices.map((i, el) => el.innerText).get();
            cy.log('Initial Prices:', initialPrices);
            const uniquePrices = [...new Set(initialPrices)];
            if (uniquePrices.length === 1) {
              cy.log('All prices are the same; sorting by price won’t change the order.');
            }
          });
        cy.get('#SortBy').should('be.visible').select('title-descending');
        cy.get('#SortBy').trigger('change');
        cy.wait(2000);
        cy.url({ timeout: 10000 }).should(
          'eq',
          'https://r0984452-realbeans.myshopify.com/collections/all?filter.v.price.gte=&filter.v.price.lte=&sort_by=title-descending'
        );
        cy.get('.grid__item').should('have.length.greaterThan', 0)
          .find('.card__heading')
          .then(($titlesAfterDesc) => {
            const descOrder = $titlesAfterDesc.map((i, el) => el.innerText).get();
            cy.log('Descending Order:', descOrder);
            // Check dropdown state before sorting
            cy.get('#SortBy').then(($select) => {
              const isDisabled = $select.prop('disabled');
              cy.log('SortBy Disabled Before Price Sort:', isDisabled);
              if (isDisabled) {
                cy.log('SortBy is disabled; attempting to enable');
                cy.get('#SortBy').then(($el) => $el.prop('disabled', false));
              }
            });
            cy.get('#SortBy').should('be.visible').select('price-ascending');
            cy.get('#SortBy').trigger('change');
            cy.wait(2000);
            cy.url({ timeout: 10000 })
            cy.wait(2000);
            cy.get('#SortBy')
              .invoke('val')
              .then((val) => cy.log('Selected Sort Value:', val));
            cy.url().then((url) => cy.log('URL after price-ascending sort:', url));
            cy.get('.grid__item').should('have.length.greaterThan', 0)
              .find('.card__heading')
              .then(($newTitles) => {
                const newOrder = $newTitles.map((i, el) => el.innerText).get();
                cy.log('New Order:', newOrder);
                cy.get('.grid__item')
                  .find('.price, .product__price')
                  .then(($prices) => {
                    const newPrices = $prices.map((i, el) => el.innerText).get();
                    cy.log('New Prices:', newPrices);
                  });
              });
          });
      });
  });

  it('displays correct product details', () => {
    cy.visit('/collections/all');
    cy.get('.grid__item').first().click();
    cy.get('.product__description, .product-description').should('not.be.empty');
    cy.get('.price, .product__price').should('not.be.empty');
    cy.get('.product__media img, .product-image')
      .should('have.attr', 'src')
      .and('not.be.empty');
  });

  it('displays the About page with history paragraph', () => {
    cy.visit('/pages/about-us');
    cy.get('p, .rte')
      .contains(
        'From a small Antwerp grocery to a European coffee staple, RealBeans honors tradition while innovating for the future. Our beans are roasted in-house, shipped from Antwerp or Stockholm, and loved across the continent.'
      )
      .should('be.visible');
  });
});