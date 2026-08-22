const products = [
  {id:'oil', name:'Late Harvest Olive Oil', kind:'Oils & Vinegars', price:28, bg:'#d9c95a', tag:'Best seller', visual:'olive'},
  {id:'tomato', name:'Good Tomato Summer Sauce', kind:'Sauces & Spreads', price:13, bg:'#e7b2a0', tag:'New', visual:'jar'},
  {id:'pasta', name:'Casarecce, Bronze Cut', kind:'Pasta & Grains', price:11, bg:'#d8d9b0', visual:'pasta'},
  {id:'honey', name:'Wildflower Raw Honey', kind:'Sweet Things', price:18, bg:'#e7bd60', visual:'honey'},
  {id:'vinegar', name:'Meyer Lemon Vinegar', kind:'Oils & Vinegars', price:19, bg:'#cddbbd', visual:'vinegar'},
  {id:'chili', name:'Calabrian Chili Crisp', kind:'Sauces & Spreads', price:15, bg:'#dd9b79', visual:'chili'},
  {id:'farro', name:'Pearled Farro', kind:'Pasta & Grains', price:12, bg:'#e1c993', visual:'farro'},
  {id:'jam', name:'Strawberry & Rose Jam', kind:'Sweet Things', price:14, bg:'#ddb2b3', visual:'jam'}
];
let cart = JSON.parse(localStorage.getItem('goodfare-cart') || '[]');
let activeFilter = 'All';
const $ = s => document.querySelector(s);
const visual = (p, className='') => {
  const labels = {oil:['GOLDFIELD','OLIVE OIL'],tomato:['GOOD TOMATO','SUMMER SAUCE'],pasta:['CASARECCE','bronze cut'],honey:['WILDFLOWER','RAW HONEY'],vinegar:['MEYER LEMON','VINEGAR'],chili:['CHILI CRISP','CALABRIA'],farro:['PEARLED','FARRO'],jam:['STRAWBERRY','& ROSE']};
  const [top,bottom] = labels[p.visual];
  if(['oil','vinegar'].includes(p.visual)) return `<div class="olive ${className}" style="background:${p.visual==='vinegar'?'#bddb91':'#e7d23f'}"><i></i><b>${top}</b><small>${bottom}</small></div>`;
  if(['tomato','chili','jam','honey'].includes(p.visual)) return `<div class="jar ${className}" style="background:${p.visual==='chili'?'#dc7551':p.visual==='jam'?'#ebc7c5':p.visual==='honey'?'#ecbf45':'#f7e7d2'}"><i></i><b>${top}</b><small>${bottom}</small></div>`;
  return `<div class="pasta ${className}" style="background:${p.visual==='farro'?'#e2bd75':'#f3e5ae'}"><b>${top}</b><small>${bottom}</small><i>〰〰〰</i></div>`;
};
function filteredProducts() {
  const query = ($('#searchInput')?.value || '').toLowerCase();
  return products.filter(p => (activeFilter === 'All' || p.kind === activeFilter) && (!query || `${p.name} ${p.kind}`.toLowerCase().includes(query)));
}
function renderProducts() {
  const shown = filteredProducts();
  $('#productGrid').innerHTML = shown.map(p => `<article class="product-card"><div class="product-image" data-details="${p.id}" role="button" tabindex="0" style="--product-bg:${p.bg}" aria-label="View ${p.name}">${p.tag?`<span class="tag">${p.tag}</span>`:''}<div class="product-visual">${visual(p)}</div><button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div><div class="product-info"><p>${p.kind}</p><div><h3>${p.name}</h3><strong>$${p.price}</strong></div></div></article>`).join('');
  $('#emptyState').hidden = Boolean(shown.length); $('#loadMore').hidden = !shown.length;
  $('#resultsMeta').textContent = shown.length === products.length ? `Showing all ${products.length} pantry goods` : `Showing ${shown.length} pantry good${shown.length === 1 ? '' : 's'}`;
}
function saveCart(){ localStorage.setItem('goodfare-cart',JSON.stringify(cart)); }
function renderCart(){
  const count=cart.reduce((n,i)=>n+i.quantity,0), total=cart.reduce((n,i)=>n+i.price*i.quantity,0);
  $('#cartCount').textContent=count; $('#drawerCount').textContent=count;
  $('#cartEmpty').hidden=Boolean(cart.length); $('#cartFooter').hidden=!cart.length;
  $('#cartItems').innerHTML=cart.map(i=>`<div class="cart-item"><div class="cart-thumb">${visual(i,'product-visual')}</div><div><h3>${i.name}</h3><p>${i.kind}</p><div class="qty"><button data-qty="${i.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${i.quantity}</span><button data-qty="${i.id}" data-change="1" aria-label="Increase quantity">+</button><button class="remove" data-remove="${i.id}">Remove</button></div></div><strong>$${(i.price*i.quantity).toFixed(2)}</strong></div>`).join('');
  $('#subtotal').textContent=`$${total.toFixed(2)}`; saveCart();
}
function addToCart(id){const p=products.find(p=>p.id===id), found=cart.find(i=>i.id===id); found ? found.quantity++ : cart.push({...p,quantity:1}); renderCart(); openDrawer();}
function openDrawer(){ $('#overlay').hidden=false; $('#cartDrawer').classList.add('open'); $('#cartDrawer').setAttribute('aria-hidden','false'); }
function closeAll(){ $('#overlay').hidden=true; $('.drawer').classList.remove('open'); document.querySelectorAll('.modal').forEach(m=>{m.hidden=true;m.setAttribute('aria-hidden','true')}); $('#cartDrawer').setAttribute('aria-hidden','true'); }
function openModal(id){closeAll(); $('#overlay').hidden=false; const m=$(`#${id}`);m.hidden=false;m.setAttribute('aria-hidden','false'); if(id==='searchModal') setTimeout(()=>$('#searchInput').focus(),20);}
function showProduct(id){const p=products.find(x=>x.id===id), m=$('#productModal'); closeAll(); $('#overlay').hidden=false;m.hidden=false;m.setAttribute('aria-hidden','false');m.innerHTML=`<button class="close" data-close="productModal" aria-label="Close product">×</button><div class="product-detail"><div class="detail-image" style="background:${p.bg}"><div class="product-visual">${visual(p)}</div></div><div><p class="eyebrow">${p.kind}</p><h2>${p.name}</h2><p class="detail-price">$${p.price}.00</p><p>Made with simple, expressive ingredients and a little extra care. A pantry staple you’ll want to reach for every day.</p><button class="button button-dark" data-add="${p.id}">Add to bag <span>→</span></button></div></div>`;}
function renderSearch(){const q=$('#searchInput').value.toLowerCase(), list=products.filter(p=>`${p.name} ${p.kind}`.toLowerCase().includes(q)); $('#searchResults').innerHTML=q ? (list.length?list.map(p=>`<button class="search-result" data-details="${p.id}"><span>${p.name}<small>${p.kind}</small></span><strong>$${p.price}</strong></button>`).join(''):'<p>No matches yet. Try another word.</p>'):'<p>Try “olive oil”, “pasta”, or “sweet”.</p>';}
function checkout(){if(!cart.length)return; openModal('checkoutModal'); const total=cart.reduce((n,i)=>n+i.price*i.quantity,0);$('#checkoutContent').innerHTML=`<p class="eyebrow">Secure checkout</p><h2>Almost there.</h2><form id="checkoutForm"><div class="checkout-row"><label>First name<input required></label><label>Last name<input required></label></div><label>Email address<input type="email" required></label><label>Shipping address<input required></label><div class="checkout-row"><label>City<input required></label><label>Postal code<input required></label></div><div class="checkout-total"><span>Order total</span><strong>$${total.toFixed(2)}</strong></div><button class="button button-dark full">Place order <span>→</span></button></form>`;}
document.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]'), detail=e.target.closest('[data-details]'), close=e.target.closest('[data-close]'), qty=e.target.closest('[data-qty]'), remove=e.target.closest('[data-remove]');
  if(add){addToCart(add.dataset.add);return} if(detail){showProduct(detail.dataset.details);return} if(close){closeAll();return}
  if(qty){const i=cart.find(x=>x.id===qty.dataset.qty);i.quantity+=Number(qty.dataset.change);if(i.quantity<1)cart=cart.filter(x=>x!==i);renderCart()} if(remove){cart=cart.filter(i=>i.id!==remove.dataset.remove);renderCart()}
});
$('#cartButton').addEventListener('click',openDrawer); $('#overlay').addEventListener('click',closeAll); $('#searchButton').addEventListener('click',()=>openModal('searchModal')); $('#accountButton').addEventListener('click',()=>openModal('authModal')); $('#menuButton').addEventListener('click',()=>$('#shop').scrollIntoView());
$('#searchInput').addEventListener('input',renderSearch); $('#checkoutButton').addEventListener('click',checkout);
$('#filterButton').addEventListener('click',()=>$('.filters').scrollIntoView({behavior:'smooth',block:'center'}));
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));renderProducts()}));
document.querySelectorAll('[data-category]').forEach(a=>a.addEventListener('click',()=>{activeFilter=a.dataset.category;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===activeFilter));renderProducts()}));
$('#resetButton').addEventListener('click',()=>{activeFilter='All';$('#searchInput').value='';renderProducts()});
$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();$('#newsletterMessage').textContent='You’re on the list. Welcome to the pantry.';e.target.reset()});
$('#authForm').addEventListener('submit',e=>{e.preventDefault();$('#authModal').innerHTML=`<button class="close" data-close="authModal" aria-label="Close account">×</button><p class="eyebrow">Your goodfare</p><h2>Hello, Jamie.</h2><div class="account-summary"><div><small>Orders placed</small><strong>2</strong></div><div><small>Pantry points</small><strong>140</strong></div></div><section class="account-section"><h3>Recent orders</h3><div class="order-row"><span><strong>GF-10482</strong><small>May 13, 2025 · Delivered</small></span><strong>$47.00</strong></div><div class="order-row"><span><strong>GF-10291</strong><small>Mar 22, 2025 · Delivered</small></span><strong>$31.00</strong></div></section><section class="account-section"><h3>Account settings</h3><form id="settingsForm"><label>Email address<input type="email" value="jamie@example.com" required></label><button class="text-link">Save changes →</button></form><p class="form-message" id="settingsMessage"></p></section>`;});
document.addEventListener('submit',e=>{if(e.target.id==='settingsForm'){e.preventDefault();$('#settingsMessage').textContent='Your settings have been saved.'}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll(); if(e.key==='Enter'&&e.target.matches('[data-details]'))showProduct(e.target.dataset.details)});
document.addEventListener('submit',e=>{if(e.target.id==='checkoutForm'){e.preventDefault();cart=[];renderCart();$('#checkoutContent').innerHTML='<div class="confirmation"><div class="check">✓</div><p class="eyebrow">Order confirmed</p><h2>Good things are on their way.</h2><p>We sent your order details to your email. Thanks for shopping small and delicious.</p><button class="button button-dark" data-close="checkoutModal">Continue shopping</button></div>'}});
renderProducts();renderCart();renderSearch();
