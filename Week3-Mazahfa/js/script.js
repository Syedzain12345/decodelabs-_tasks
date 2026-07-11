/* ==========================================================================
   MAZAHFA — Futuristic E-Commerce Experience
   Main Script
   ========================================================================== */
'use strict';

/* ==========================================================================
   1. DATA
   ========================================================================== */
const CATEGORIES = [
  { id:'phones',      name:'Smartphones',  icon:'fa-mobile-screen-button', count:'24 items' },
  { id:'laptop',       name:'Laptops',      icon:'fa-laptop',               count:'18 items' },
  { id:'gaming',       name:'Gaming',       icon:'fa-gamepad',              count:'20 items' },
  { id:'accessories',  name:'Smart Watches',icon:'fa-clock',                count:'15 items' },
  { id:'accessories',  name:'Audio',        icon:'fa-headphones',           count:'22 items' },
  { id:'accessories',  name:'Accessories',  icon:'fa-plug',                 count:'31 items' },
];

const PRODUCTS = [
  { id:1,  name:'Nova X12 Smartphone',      cat:'phones',      catLabel:'Smartphone',  icon:'fa-mobile-screen-button', price:899,  oldPrice:1099, rating:4.8, reviews:210, badge:'Sale',  trending:true  },
  { id:2,  name:'Pulse Air Buds',           cat:'accessories', catLabel:'Audio',       icon:'fa-headphones',           price:129,  oldPrice:null, rating:4.6, reviews:340, badge:'New',   trending:true  },
  { id:3,  name:'Vortex Gaming Console',    cat:'gaming',      catLabel:'Gaming',      icon:'fa-gamepad',              price:499,  oldPrice:null, rating:4.9, reviews:180, badge:null,    trending:true  },
  { id:4,  name:'AeroBook Pro 14',          cat:'laptop',       catLabel:'Laptop',      icon:'fa-laptop',               price:1399, oldPrice:1599, rating:4.7, reviews:96,  badge:'Sale',  trending:true  },
  { id:5,  name:'ChronoFit Watch',          cat:'accessories', catLabel:'Wearable',    icon:'fa-clock',                price:249,  oldPrice:null, rating:4.5, reviews:150, badge:'New',   trending:false },
  { id:6,  name:'Specter Mechanical Keys',  cat:'accessories', catLabel:'Accessory',   icon:'fa-keyboard',             price:159,  oldPrice:null, rating:4.8, reviews:220, badge:null,    trending:false },
  { id:7,  name:'Halo VR Headset',          cat:'gaming',      catLabel:'Gaming',      icon:'fa-vr-cardboard',         price:599,  oldPrice:null, rating:4.6, reviews:88,  badge:'New',   trending:true  },
  { id:8,  name:'Nimbus Tab 11',            cat:'phones',      catLabel:'Tablet',      icon:'fa-tablet-screen-button', price:649,  oldPrice:null, rating:4.4, reviews:112, badge:null,    trending:false },
  { id:9,  name:'ZenBook Air 13',           cat:'laptop',       catLabel:'Laptop',      icon:'fa-laptop',               price:1099, oldPrice:null, rating:4.4, reviews:140, badge:null,    trending:false },
  { id:10, name:'Quantum Wireless Mouse',   cat:'accessories', catLabel:'Accessory',   icon:'fa-computer-mouse',       price:79,   oldPrice:null, rating:4.7, reviews:310, badge:null,    trending:false },
  { id:11, name:'Titan Gaming Chair',       cat:'gaming',      catLabel:'Gaming',      icon:'fa-chair',                price:329,  oldPrice:399,  rating:4.5, reviews:75,  badge:'Sale',  trending:false },
  { id:12, name:'Orbit Smart Speaker',      cat:'accessories', catLabel:'Audio',       icon:'fa-volume-high',          price:99,   oldPrice:null, rating:4.3, reviews:190, badge:null,    trending:false },
  { id:13, name:'Nova X12 Mini',            cat:'phones',      catLabel:'Smartphone',  icon:'fa-mobile-screen-button', price:699,  oldPrice:null, rating:4.6, reviews:130, badge:null,    trending:false },
  { id:14, name:'Flux Power Bank 20K',      cat:'accessories', catLabel:'Accessory',   icon:'fa-battery-full',         price:59,   oldPrice:null, rating:4.7, reviews:410, badge:null,    trending:false },
];

const REVIEWS = [
  { name:'Amara Chen',      role:'Verified Buyer', initials:'AC', stars:5, quote:'Mazahfa feels like shopping five years ahead of everyone else. The AeroBook arrived in two days and it is stunning.' },
  { name:'Liam Osei',       role:'Verified Buyer', initials:'LO', stars:5, quote:'The Vortex console is a beast, and the checkout experience was honestly the smoothest I have ever used.' },
  { name:'Sana Iqbal',      role:'Verified Buyer', initials:'SI', stars:4, quote:'Loved the Pulse Air Buds. Delivery tracking was spot on and the packaging felt genuinely premium.' },
  { name:'Diego Fernandez', role:'Verified Buyer', initials:'DF', stars:5, quote:'Customer support resolved my warranty question in minutes. This is how electronics retail should feel.' },
  { name:'Priya Nair',      role:'Verified Buyer', initials:'PN', stars:5, quote:'The site itself is an experience — smooth, fast, and the flash sale saved me a real chunk of money.' },
];

/* ==========================================================================
   2. STATE (persisted to localStorage)
   ========================================================================== */
const Store = {
  theme: localStorage.getItem('mazahfa_theme') || 'dark',
  wishlist: new Set(JSON.parse(localStorage.getItem('mazahfa_wishlist') || '[]')),
  cart: new Map(Object.entries(JSON.parse(localStorage.getItem('mazahfa_cart') || '{}')).map(([k,v]) => [Number(k), v])),
  saveTheme(){ localStorage.setItem('mazahfa_theme', this.theme); },
  saveWishlist(){ localStorage.setItem('mazahfa_wishlist', JSON.stringify([...this.wishlist])); },
  saveCart(){ localStorage.setItem('mazahfa_cart', JSON.stringify(Object.fromEntries(this.cart))); }
};

let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'default';

/* ==========================================================================
   3. HELPERS
   ========================================================================== */
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
const fmt = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0 });

function starsHTML(rating){
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let html = '';
  for(let i=0;i<full;i++) html += '<i class="fa-solid fa-star"></i>';
  if(half) html += '<i class="fa-solid fa-star-half-stroke"></i>';
  for(let i=full+(half?1:0); i<5; i++) html += '<i class="fa-regular fa-star"></i>';
  return html;
}

function showToast(message, icon='fa-solid fa-circle-check'){
  const container = $('#toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 3200);
}

/* ==========================================================================
   4. LOADING SCREEN
   ========================================================================== */
(function initLoader(){
  const loader = $('#loader');
  const fill = $('#loaderFill');
  const pct = $('#loaderPct');
  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if(progress >= 100){
      progress = 100;
      clearInterval(timer);
      fill.style.width = '100%';
      pct.textContent = '100%';
      setTimeout(() => {
        loader.classList.add('hide');
        document.body.style.overflow = '';
        revealOnLoad();
      }, 350);
      return;
    }
    fill.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 160);
  document.body.style.overflow = 'hidden';
})();

function revealOnLoad(){
  $$('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('in'), i * 140));
}

/* ==========================================================================
   5. SCROLL PROGRESS + NAVBAR SOLID + FAB + PARALLAX
   ========================================================================== */
const scrollProgressFill = $('#scrollProgress');
const navbar = $('#navbar');
const fab = $('#fabTop');
const heroContent = $('.hero-content');
const heroCanvasEl = $('#heroCanvas');
const heroGridEl = $('.hero-grid');
const FAB_CIRCUMFERENCE = 2 * Math.PI * 20;

function onScroll(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgressFill.style.width = pct + '%';

  navbar.classList.toggle('solid', scrollTop > 40);

  if(scrollTop > 500){
    fab.classList.add('show');
    const offset = FAB_CIRCUMFERENCE - (pct/100) * FAB_CIRCUMFERENCE;
    fab.style.setProperty('--fab-progress', offset);
  } else {
    fab.classList.remove('show');
  }

  // Hero parallax — background moves slower, text fades on scroll
  if(scrollTop < window.innerHeight){
    heroContent.style.transform = `translateY(${scrollTop * 0.28}px)`;
    heroContent.style.opacity = String(Math.max(0, 1 - scrollTop / 480));
    heroCanvasEl.style.transform = `translateY(${scrollTop * 0.12}px)`;
    heroGridEl.style.transform = `translateY(${scrollTop * 0.08}px)`;
  }
}
window.addEventListener('scroll', onScroll, { passive:true });

fab.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

/* ==========================================================================
   6. CURSOR GLOW
   ========================================================================== */
const cursorGlow = $('#cursorGlow');
const cursorDot = $('#cursorDot');
window.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
});
document.addEventListener('mouseover', e => {
  if(e.target.closest('a, button, input, .product-card, .category-card')){
    cursorDot.style.width = '20px';
    cursorDot.style.height = '20px';
  }
});
document.addEventListener('mouseout', e => {
  if(e.target.closest('a, button, input, .product-card, .category-card')){
    cursorDot.style.width = '8px';
    cursorDot.style.height = '8px';
  }
});

/* ==========================================================================
   7. HERO PARTICLE CANVAS + MOUSE GLOW
   ========================================================================== */
(function heroCanvasInit(){
  const canvas = $('#heroCanvas');
  const hero = $('#hero');
  const heroGlow = $('#heroGlow');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize(){
    const rect = hero.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
    const count = Math.min(70, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6
    }));
  }

  function tick(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0) p.x = w; if(p.x > w) p.x = 0;
      if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(95,227,220,0.55)';
      ctx.fill();
    });
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 130){
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(58,175,169,${0.18 * (1 - dist/130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }

  resize();
  requestAnimationFrame(tick);
  window.addEventListener('resize', resize);

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    heroGlow.style.left = (e.clientX - rect.left) + 'px';
    heroGlow.style.top = (e.clientY - rect.top) + 'px';
  });
})();

/* ==========================================================================
   8. NAVBAR: mobile toggle, smooth scroll, theme switch
   ========================================================================== */
const mobileToggle = $('#mobileToggle');
const navLinks = $('#navLinks');
mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
$$('.nav-links a').forEach(a => a.addEventListener('click', () => {
  mobileToggle.classList.remove('open');
  navLinks.classList.remove('open');
}));

$$('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = $(btn.dataset.scroll);
    if(target) target.scrollIntoView({ behavior:'smooth' });
  });
});

function applyTheme(theme){
  document.body.setAttribute('data-theme', theme);
  Store.theme = theme;
  Store.saveTheme();
  $$('.theme-opt').forEach(b => b.classList.toggle('active', b.dataset.themeOpt === theme));
}
$$('.theme-opt').forEach(btn => btn.addEventListener('click', () => applyTheme(btn.dataset.themeOpt)));
applyTheme(Store.theme);

/* ==========================================================================
   9. MAGNETIC BUTTONS + RIPPLE
   ========================================================================== */
$$('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    btn.style.transform = `translate(${x*0.25}px, ${y*0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

document.addEventListener('click', e => {
  const el = e.target.closest('.btn, .filter-btn, .icon-btn, .theme-opt, .add-to-cart-btn, .category-card, .fab');
  if(!el) return;
  const rect = el.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height) * 1.4;
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
  el.style.position = el.style.position || 'relative';
  el.style.overflow = el.style.overflow === 'visible' ? el.style.overflow : el.style.overflow;
  el.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

/* ==========================================================================
   10. INTERSECTION OBSERVER — SCROLL REVEALS
   ========================================================================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });

function observeReveals(root=document){
  $$('.reveal, .reveal-left, .reveal-zoom, .reveal-rotate, .category-card, .product-card', root)
    .forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   11. RENDER: CATEGORIES
   ========================================================================== */
function renderCategories(){
  const grid = $('#categoryGrid');
  grid.innerHTML = CATEGORIES.map(c => `
    <div class="category-card reveal-zoom" data-filter="${c.id}">
      <span class="cat-count">${c.count}</span>
      <div class="category-icon"><i class="fa-solid ${c.icon}"></i></div>
      <h3>${c.name}</h3>
      <p>Explore the latest in ${c.name.toLowerCase()}.</p>
    </div>
  `).join('');

  $$('.category-card', grid).forEach(card => {
    card.addEventListener('click', () => {
      const filter = card.dataset.filter;
      setFilter(filter);
      $('#products').scrollIntoView({ behavior:'smooth' });
    });
  });
}

/* ==========================================================================
   12. RENDER: PRODUCT CARD MARKUP
   ========================================================================== */
function productCardHTML(p, opts={}){
  const inWishlist = Store.wishlist.has(p.id);
  return `
  <article class="product-card ${opts.static ? 'in' : ''}" data-id="${p.id}" data-cat="${p.cat}" data-name="${p.name.toLowerCase()}">
    <div class="product-media">
      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      <button class="product-wishlist ${inWishlist ? 'active' : ''}" data-id="${p.id}" aria-label="Toggle wishlist">
        <i class="fa-${inWishlist ? 'solid' : 'regular'} fa-heart"></i>
      </button>
      <i class="fa-solid ${p.icon}"></i>
      <div class="product-actions">
        <button class="add-to-cart-btn" data-id="${p.id}"><i class="fa-solid fa-bag-shopping"></i> Add to Cart</button>
      </div>
    </div>
    <div class="product-info">
      <span class="product-cat">${p.catLabel}</span>
      <h4>${p.name}</h4>
      <div class="product-rating">${starsHTML(p.rating)} <span>(${p.reviews})</span></div>
      <div class="product-price-row">
        <span class="product-price">${fmt(p.price)}</span>
        ${p.oldPrice ? `<span class="product-price-old">${fmt(p.oldPrice)}</span>` : ''}
      </div>
    </div>
  </article>`;
}

/* ==========================================================================
   13. RENDER + FILTER + SEARCH + SORT: PRODUCT GRID
   ========================================================================== */
function getFilteredProducts(){
  let list = PRODUCTS.filter(p => currentFilter === 'all' || p.cat === currentFilter);
  if(currentSearch.trim()){
    const q = currentSearch.trim().toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.catLabel.toLowerCase().includes(q));
  }
  if(currentSort === 'price-asc') list = [...list].sort((a,b) => a.price - b.price);
  if(currentSort === 'price-desc') list = [...list].sort((a,b) => b.price - a.price);
  if(currentSort === 'rating-desc') list = [...list].sort((a,b) => b.rating - a.rating);
  return list;
}

function renderProductGrid(){
  const grid = $('#productGrid');
  const list = getFilteredProducts();
  grid.style.opacity = '0';
  setTimeout(() => {
    grid.innerHTML = list.length
      ? list.map(p => productCardHTML(p)).join('')
      : `<p class="search-empty" style="grid-column:1/-1; text-align:center;">No products match your search. Try a different keyword or filter.</p>`;
    grid.style.opacity = '1';
    bindProductCardEvents(grid);
    observeReveals(grid);
  }, 180);
}

function bindProductCardEvents(root){
  $$('.product-wishlist', root).forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleWishlist(Number(btn.dataset.id), btn);
    });
  });
  $$('.add-to-cart-btn', root).forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      addToCart(Number(btn.dataset.id));
    });
  });
}

function setFilter(filter){
  currentFilter = filter;
  $$('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
  renderProductGrid();
}
$$('.filter-btn').forEach(btn => btn.addEventListener('click', () => setFilter(btn.dataset.filter)));

$('#sortSelect').addEventListener('change', e => {
  currentSort = e.target.value;
  renderProductGrid();
});

/* ==========================================================================
   14. WISHLIST
   ========================================================================== */
function toggleWishlist(id, btnEl){
  const product = PRODUCTS.find(p => p.id === id);
  if(Store.wishlist.has(id)){
    Store.wishlist.delete(id);
    showToast(`Removed ${product.name} from wishlist`, 'fa-regular fa-heart');
  } else {
    Store.wishlist.add(id);
    showToast(`${product.name} added to wishlist`, 'fa-solid fa-heart');
  }
  Store.saveWishlist();
  updateWishlistUI();
  // sync all instances of this card (grid + slider) if present
  $$(`.product-wishlist[data-id="${id}"]`).forEach(b => {
    const active = Store.wishlist.has(id);
    b.classList.toggle('active', active);
    b.querySelector('i').className = `fa-${active ? 'solid' : 'regular'} fa-heart`;
  });
}

function updateWishlistUI(){
  const count = Store.wishlist.size;
  const badge = $('#wishlistCount');
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);
}

/* ==========================================================================
   15. CART
   ========================================================================== */
function addToCart(id){
  const product = PRODUCTS.find(p => p.id === id);
  const qty = Store.cart.get(id) || 0;
  Store.cart.set(id, qty + 1);
  Store.saveCart();
  updateCartUI();
  showToast(`${product.name} added successfully`, 'fa-solid fa-circle-check');
}

function changeQty(id, delta){
  const qty = (Store.cart.get(id) || 0) + delta;
  if(qty <= 0){ Store.cart.delete(id); } else { Store.cart.set(id, qty); }
  Store.saveCart();
  updateCartUI();
}

function removeFromCart(id){
  Store.cart.delete(id);
  Store.saveCart();
  updateCartUI();
}

function updateCartUI(){
  const badge = $('#cartCount');
  const totalItems = [...Store.cart.values()].reduce((s,q) => s+q, 0);
  badge.textContent = totalItems;
  badge.classList.toggle('show', totalItems > 0);

  const itemsWrap = $('#cartItems');
  if(Store.cart.size === 0){
    itemsWrap.innerHTML = `<p class="drawer-empty">Your bag is empty. Time to explore the future.</p>`;
  } else {
    itemsWrap.innerHTML = [...Store.cart.entries()].map(([id, qty]) => {
      const p = PRODUCTS.find(pr => pr.id === id);
      return `
      <div class="drawer-item" data-id="${id}">
        <div class="drawer-item-thumb"><i class="fa-solid ${p.icon}"></i></div>
        <div class="drawer-item-info">
          <h5>${p.name}</h5>
          <span>${fmt(p.price)}</span>
          <div class="drawer-item-qty">
            <button data-action="dec" aria-label="Decrease quantity">−</button>
            <span>${qty}</span>
            <button data-action="inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="drawer-item-remove" data-action="remove" aria-label="Remove item"><i class="fa-solid fa-trash"></i></button>
      </div>`;
    }).join('');
  }

  const total = [...Store.cart.entries()].reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find(pr => pr.id === id);
    return sum + p.price * qty;
  }, 0);
  $('#cartTotal').textContent = fmt(total);

  $$('.drawer-item', itemsWrap).forEach(row => {
    const id = Number(row.dataset.id);
    row.querySelector('[data-action="dec"]').addEventListener('click', () => changeQty(id, -1));
    row.querySelector('[data-action="inc"]').addEventListener('click', () => changeQty(id, 1));
    row.querySelector('[data-action="remove"]').addEventListener('click', () => removeFromCart(id));
  });
}

const cartDrawer = $('#cartDrawer');
const drawerOverlay = $('#drawerOverlay');
function openCart(){ cartDrawer.classList.add('open'); drawerOverlay.classList.add('open'); }
function closeCart(){ cartDrawer.classList.remove('open'); drawerOverlay.classList.remove('open'); }
$('#cartBtn').addEventListener('click', openCart);
$('#cartClose').addEventListener('click', closeCart);
drawerOverlay.addEventListener('click', closeCart);
$('#checkoutBtn').addEventListener('click', () => {
  if(Store.cart.size === 0){ showToast('Your bag is empty', 'fa-solid fa-circle-info'); return; }
  showToast('This is a demo checkout — thanks for shopping the future!', 'fa-solid fa-rocket');
  Store.cart.clear();
  Store.saveCart();
  updateCartUI();
  closeCart();
});
$('#wishlistBtn').addEventListener('click', () => {
  setFilter('all');
  $('#products').scrollIntoView({ behavior:'smooth' });
  showToast(`You have ${Store.wishlist.size} item(s) in your wishlist`, 'fa-solid fa-heart');
});

/* ==========================================================================
   16. SEARCH OVERLAY
   ========================================================================== */
const searchOverlay = $('#searchOverlay');
const searchInput = $('#searchInput');
function openSearch(){
  searchOverlay.classList.add('open');
  setTimeout(() => searchInput.focus(), 300);
}
function closeSearch(){
  searchOverlay.classList.remove('open');
  searchInput.value = '';
  currentSearch = '';
  renderProductGrid();
}
$('#searchBtn').addEventListener('click', openSearch);
$('#searchClose').addEventListener('click', closeSearch);
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeSearch(); });

searchInput.addEventListener('input', e => {
  currentSearch = e.target.value;
  renderProductGrid();
  const q = currentSearch.trim().toLowerCase();
  const results = $('#searchResults');
  if(!q){ results.innerHTML = ''; return; }
  const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.catLabel.toLowerCase().includes(q));
  results.innerHTML = matches.length
    ? matches.map(p => `<div class="search-result-item" data-id="${p.id}"><span>${p.name}</span><span>${fmt(p.price)}</span></div>`).join('')
    : `<p class="search-empty">No products found for "${currentSearch}".</p>`;
  $$('.search-result-item', results).forEach(item => {
    item.addEventListener('click', () => {
      closeSearch();
      setTimeout(() => {
        const card = $(`.product-card[data-id="${item.dataset.id}"]`);
        if(card){
          card.scrollIntoView({ behavior:'smooth', block:'center' });
          card.style.boxShadow = '0 0 0 3px var(--accent)';
          setTimeout(() => card.style.boxShadow = '', 1200);
        }
      }, 400);
    });
  });
});

/* ==========================================================================
   17. TRENDING SLIDER
   ========================================================================== */
let sliderIndex = 0;
let sliderAutoTimer = null;

function renderSlider(){
  const track = $('#sliderTrack');
  const trending = PRODUCTS.filter(p => p.trending);
  track.innerHTML = trending.map(p => productCardHTML(p, { static:true })).join('');
  bindProductCardEvents(track);
  updateSliderPosition();
}

function updateSliderPosition(){
  const track = $('#sliderTrack');
  const card = track.querySelector('.product-card');
  if(!card) return;
  const gap = 22;
  const cardWidth = card.getBoundingClientRect().width + gap;
  const maxIndex = track.children.length - 1;
  if(sliderIndex > maxIndex) sliderIndex = 0;
  if(sliderIndex < 0) sliderIndex = maxIndex;
  track.style.transform = `translateX(-${sliderIndex * cardWidth}px)`;
}

function slideNext(){ sliderIndex++; updateSliderPosition(); }
function slidePrev(){ sliderIndex--; updateSliderPosition(); }

$('#sliderNext').addEventListener('click', () => { slideNext(); restartSliderAuto(); });
$('#sliderPrev').addEventListener('click', () => { slidePrev(); restartSliderAuto(); });

function restartSliderAuto(){
  clearInterval(sliderAutoTimer);
  sliderAutoTimer = setInterval(slideNext, 4200);
}
const sliderWrap = $('.slider-wrap');
sliderWrap.addEventListener('mouseenter', () => clearInterval(sliderAutoTimer));
sliderWrap.addEventListener('mouseleave', restartSliderAuto);
window.addEventListener('resize', updateSliderPosition);

/* ==========================================================================
   18. FLASH SALE COUNTDOWN
   ========================================================================== */
(function countdown(){
  let totalSeconds = 5 * 3600 + 20 * 60 + 45;
  const hEl = $('#cdHours'), mEl = $('#cdMinutes'), sEl = $('#cdSeconds');
  function pad(n){ return String(n).padStart(2,'0'); }
  function tick(){
    if(totalSeconds <= 0) totalSeconds = 5 * 3600 + 20 * 60 + 45; // loop for demo
    totalSeconds--;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    hEl.textContent = pad(h); mEl.textContent = pad(m); sEl.textContent = pad(s);
  }
  setInterval(tick, 1000);
})();

/* Read more toggle */
const readMoreBtn = $('#readMoreBtn');
readMoreBtn.addEventListener('click', () => {
  const extra = $('#flashExtra');
  const open = extra.hasAttribute('hidden') === false;
  if(open){
    extra.setAttribute('hidden','');
    readMoreBtn.classList.remove('open');
    readMoreBtn.innerHTML = 'Read more <i class="fa-solid fa-chevron-down"></i>';
  } else {
    extra.removeAttribute('hidden');
    readMoreBtn.classList.add('open');
    readMoreBtn.innerHTML = 'Show less <i class="fa-solid fa-chevron-down"></i>';
  }
});

/* ==========================================================================
   19. ANIMATED STATISTICS
   ========================================================================== */
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting && !entry.target.dataset.animated){
      entry.target.dataset.animated = 'true';
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold:0.5 });

function animateCount(el){
  const target = parseFloat(el.dataset.count);
  const decimals = Number(el.dataset.decimal || 0);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  function frame(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = value.toFixed(decimals) + suffix;
    if(progress < 1) requestAnimationFrame(frame);
    else el.textContent = target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(frame);
}
$$('.stat-number').forEach(el => statObserver.observe(el));

/* ==========================================================================
   20. CUSTOMER REVIEWS SLIDER
   ========================================================================== */
let reviewIndex = 0;
let reviewAutoTimer = null;

function renderReviews(){
  const track = $('#reviewTrack');
  const dots = $('#reviewDots');
  track.innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-stars">${starsHTML(r.stars)}</div>
      <p class="review-quote">"${r.quote}"</p>
      <div class="review-person">
        <div class="review-avatar">${r.initials}</div>
        <div>
          <h5>${r.name}</h5>
          <span>${r.role}</span>
        </div>
      </div>
    </div>
  `).join('');
  dots.innerHTML = REVIEWS.map((_, i) => `<button class="review-dot ${i===0?'active':''}" data-index="${i}" aria-label="Go to review ${i+1}"></button>`).join('');
  $$('.review-dot', dots).forEach(dot => dot.addEventListener('click', () => {
    reviewIndex = Number(dot.dataset.index);
    updateReviewPosition();
    restartReviewAuto();
  }));
}

function updateReviewPosition(){
  const track = $('#reviewTrack');
  const max = REVIEWS.length - 1;
  if(reviewIndex > max) reviewIndex = 0;
  if(reviewIndex < 0) reviewIndex = max;
  track.style.transform = `translateX(-${reviewIndex * 100}%)`;
  $$('.review-dot').forEach((d,i) => d.classList.toggle('active', i === reviewIndex));
}

$('#reviewNext').addEventListener('click', () => { reviewIndex++; updateReviewPosition(); restartReviewAuto(); });
$('#reviewPrev').addEventListener('click', () => { reviewIndex--; updateReviewPosition(); restartReviewAuto(); });
function restartReviewAuto(){
  clearInterval(reviewAutoTimer);
  reviewAutoTimer = setInterval(() => { reviewIndex++; updateReviewPosition(); }, 5000);
}
const reviewWrap = $('.review-wrap');
reviewWrap.addEventListener('mouseenter', () => clearInterval(reviewAutoTimer));
reviewWrap.addEventListener('mouseleave', restartReviewAuto);

/* ==========================================================================
   21. NEWSLETTER FORM
   ========================================================================== */
$('#newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = $('#newsletterEmail');
  const msg = $('#newsletterMsg');
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  if(!emailValid){
    msg.style.color = '#e05c5c';
    msg.textContent = 'Please enter a valid email address.';
    return;
  }
  msg.style.color = 'var(--accent)';
  msg.textContent = `You're on the list! A confirmation was sent to ${input.value.trim()}.`;
  showToast('Subscribed successfully', 'fa-solid fa-envelope-circle-check');
  input.value = '';
});

/* ==========================================================================
   22. INIT
   ========================================================================== */
function init(){
  renderCategories();
  renderProductGrid();
  renderSlider();
  renderReviews();
  updateWishlistUI();
  updateCartUI();
  observeReveals();
  restartSliderAuto();
  restartReviewAuto();
  onScroll();
}
document.addEventListener('DOMContentLoaded', init);
