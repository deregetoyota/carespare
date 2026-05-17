// Catalog page logic — filtering, sorting, search
(function () {
  const grid = document.getElementById('grid');
  const countEl = document.getElementById('count');
  const searchEl = document.getElementById('search');
  const modelEl = document.getElementById('model');
  const categoryEl = document.getElementById('category');
  const sortEl = document.getElementById('sort');

  // Populate filter dropdowns
  MODELS.forEach(m => {
    modelEl.insertAdjacentHTML('beforeend', `<option value="${m}">${m}</option>`);
  });
  CATEGORIES.forEach(c => {
    categoryEl.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`);
  });

  // Pre-select category from URL (?category=Bumpers)
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get('category');
  if (initialCategory && CATEGORIES.includes(initialCategory)) {
    categoryEl.value = initialCategory;
  }

  function render() {
    const search = searchEl.value.trim().toLowerCase();
    const model = modelEl.value;
    const category = categoryEl.value;
    const sort = sortEl.value;

    let results = PRODUCTS.filter(p => {
      if (model && p.model !== model) return false;
      if (category && p.category !== category) return false;
      if (search) {
        const haystack = `${p.name} ${p.sku} ${p.model} ${p.category}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });

    if (sort === 'price-asc') results.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') results.sort((a, b) => b.price - a.price);
    else if (sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));

    countEl.textContent = `Showing ${results.length} of ${PRODUCTS.length} parts`;

    if (results.length === 0) {
      grid.innerHTML = '<div class="no-results">No parts match your filters. Try clearing the search.</div>';
      return;
    }

    grid.innerHTML = results.map(p => `
      <div class="product-card">
        <img class="product-img" src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="product-body">
          <span class="product-tag">${p.category}</span>
          <div class="product-name">${p.name}</div>
          <div class="product-meta">${p.model} &bull; ${p.year}</div>
          <div class="product-condition">${p.condition}</div>
          <div class="product-footer">
            <span class="product-price">$${p.price}</span>
            <span class="product-sku">${p.sku}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  [searchEl, modelEl, categoryEl, sortEl].forEach(el => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  render();
})();
