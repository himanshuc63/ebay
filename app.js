const starterProducts = [
  {id:1,title:"Marketing Management — Kotler",price:450,category:"Books",condition:"Good",location:"Hostel 11",age:"2h ago",emoji:"📕",colors:["#e9d7cc","#c88d75"]},
  {id:2,title:"Casio FX-991EX Calculator",price:1200,category:"Electronics",condition:"Like new",location:"Hostel 4",age:"4h ago",emoji:"🧮",colors:["#d9e1dd","#91aaa1"]},
  {id:3,title:"Firefox Hybrid Bicycle",price:6500,category:"Cycles",condition:"Good",location:"Sports Complex",age:"6h ago",emoji:"🚲",colors:["#e4dcc9","#ba9d62"]},
  {id:4,title:"Study Table Lamp",price:500,category:"Room essentials",condition:"Like new",location:"Hostel 2",age:"Yesterday",emoji:"💡",colors:["#e2ded7","#9e978b"]},
  {id:5,title:"Financial Accounting Textbook",price:320,category:"Books",condition:"Fair",location:"Hostel 8",age:"Yesterday",emoji:"📗",colors:["#d9e4d3","#7b9a72"]},
  {id:6,title:"JBL Bluetooth Speaker",price:1800,category:"Electronics",condition:"Good",location:"Hostel 6",age:"2d ago",emoji:"🔊",colors:["#ddd5e0","#917d98"]},
  {id:7,title:"Bean Bag — Burgundy",price:900,category:"Room essentials",condition:"Good",location:"Hostel 10",age:"2d ago",emoji:"🛋️",colors:["#ead5d4","#a46066"]},
  {id:8,title:"IIMI Varsity Hoodie",price:700,category:"Fashion",condition:"Like new",location:"Hostel 3",age:"3d ago",emoji:"🧥",colors:["#d8dce3","#7d8798"]}
];

let products = JSON.parse(localStorage.getItem("campusCartProducts") || "null") || starterProducts;
let saved = JSON.parse(localStorage.getItem("campusCartSaved") || "[]");
let activeCategory = "All";
let searchTerm = "";
const $ = s => document.querySelector(s);
const money = n => `₹${Number(n).toLocaleString("en-IN")}`;

function showView(name){
  $("#buyView").classList.toggle("active", name === "buy");
  $("#sellView").classList.toggle("active", name === "sell");
  document.querySelectorAll(".nav-link").forEach(b => b.classList.toggle("active", b.dataset.view === name));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => showView(b.dataset.view)));

function renderCategories(){
  const cats = ["All",...new Set(products.map(p => p.category))];
  $("#categoryList").innerHTML = cats.map(c => `<button class="category-chip ${c===activeCategory?'active':''}" data-category="${c}">${categoryIcon(c)} ${c}</button>`).join("");
  document.querySelectorAll(".category-chip").forEach(b => b.onclick = () => {activeCategory=b.dataset.category;renderCategories();renderProducts();});
}
function categoryIcon(c){return {All:"✦",Books:"▤",Electronics:"⌁",Cycles:"○",Fashion:"◇","Room essentials":"⌂",Other:"＋"}[c]||"＋"}
function filteredProducts(){
  let list=products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&(p.title+" "+p.category+" "+p.location).toLowerCase().includes(searchTerm));
  if($("#sortSelect").value==="low") list.sort((a,b)=>a.price-b.price);
  if($("#sortSelect").value==="high") list.sort((a,b)=>b.price-a.price);
  return list;
}
function renderProducts(){
  const list=filteredProducts();
  $("#resultCount").textContent=`${list.length} ${list.length===1?'listing':'listings'} available`;
  $("#productGrid").innerHTML=list.map(p=>`<article class="product-card"><div class="product-image">${p.image?`<img src="${p.image}" alt="${escapeHtml(p.title)}">`:`<div class="emoji-art" style="--bg1:${p.colors[0]};--bg2:${p.colors[1]}">${p.emoji}</div>`}<span class="condition-tag">${p.condition}</span><button class="save-button ${saved.includes(p.id)?'saved':''}" data-id="${p.id}" aria-label="Save ${escapeHtml(p.title)}">${saved.includes(p.id)?'♥':'♡'}</button></div><div class="product-info"><div class="product-meta"><span>${p.category}</span><span>${p.age}</span></div><h3>${escapeHtml(p.title)}</h3><div class="product-bottom"><strong>${money(p.price)}</strong><span>⌖ ${escapeHtml(p.location)}</span></div></div></article>`).join("");
  $("#emptyState").hidden=!!list.length; $("#productGrid").hidden=!list.length;
  document.querySelectorAll(".save-button").forEach(b=>b.onclick=()=>toggleSaved(Number(b.dataset.id)));
}
function toggleSaved(id){
  saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];
  localStorage.setItem("campusCartSaved",JSON.stringify(saved));renderProducts();renderCart();showToast(saved.includes(id)?"Saved to your shortlist":"Removed from shortlist");
}
function renderCart(){
  const items=saved.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  $("#cartCount").textContent=items.length;$("#cartEmpty").hidden=!!items.length;$(".drawer-footer").style.display=items.length?"block":"none";
  $("#cartItems").innerHTML=items.map(p=>`<div class="cart-item"><div class="cart-item-art">${p.image?`<img src="${p.image}" alt="">`:p.emoji}</div><div><h4>${escapeHtml(p.title)}</h4><b>${money(p.price)}</b></div><button class="remove-item" data-id="${p.id}" aria-label="Remove">×</button></div>`).join("");
  $("#cartTotal").textContent=money(items.reduce((s,p)=>s+Number(p.price),0));document.querySelectorAll(".remove-item").forEach(b=>b.onclick=()=>toggleSaved(Number(b.dataset.id)));
}
function setSearch(){searchTerm=$("#searchInput").value.trim().toLowerCase();renderProducts();document.querySelector(".market-section").scrollIntoView({behavior:"smooth"})}
$("#searchButton").onclick=setSearch;$("#searchInput").onkeydown=e=>{if(e.key==="Enter")setSearch()};$("#sortSelect").onchange=renderProducts;
function resetFilters(){activeCategory="All";searchTerm="";$("#searchInput").value="";renderCategories();renderProducts()}
$("#clearFilters").onclick=resetFilters;$("#resetSearch").onclick=resetFilters;
function openCart(open=true){$("#cartDrawer").classList.toggle("open",open);$("#drawerBackdrop").classList.toggle("open",open)}
$("#cartButton").onclick=()=>openCart();$("#closeCart").onclick=()=>openCart(false);$("#drawerBackdrop").onclick=()=>openCart(false);
$("#contactSellers").onclick=()=>showToast("Seller chat will be available in the next version")

$("#description").oninput=e=>$("#charCount").textContent=e.target.value.length;
$("#photo").onchange=e=>{const file=e.target.files[0];if(!file)return;if(file.size>5*1024*1024){showToast("Please choose an image under 5 MB");e.target.value="";return}const r=new FileReader();r.onload=()=>{$("#photoPreview").src=r.result;$("#photoPreview").hidden=false;$("#uploadPrompt").hidden=true};r.readAsDataURL(file)};
$("#listingForm").onsubmit=e=>{e.preventDefault();const item={id:Date.now(),title:$("#title").value.trim(),price:Number($("#price").value),category:$("#category").value,condition:$("#condition").value,location:$("#location").value.trim(),description:$("#description").value.trim(),age:"Just now",emoji:"📦",colors:["#eadfd4","#b7967d"],image:$("#photoPreview").hidden?null:$("#photoPreview").src};products.unshift(item);try{localStorage.setItem("campusCartProducts",JSON.stringify(products))}catch{item.image=null;localStorage.setItem("campusCartProducts",JSON.stringify(products))}e.target.reset();$("#photoPreview").hidden=true;$("#uploadPrompt").hidden=false;$("#charCount").textContent="0";activeCategory="All";renderCategories();renderProducts();showView("buy");showToast("Your listing is now live!")};
function showToast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),2600)}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]))}
renderCategories();renderProducts();renderCart();

// Listing detail view and client-side routing
function showView(name){
  $("#buyView").classList.toggle("active",name==="buy");
  $("#sellView").classList.toggle("active",name==="sell");
  $("#detailView").classList.toggle("active",name==="detail");
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  window.scrollTo({top:0,behavior:"smooth"});
}

function productCard(p){
  const art=p.image?`<img src="${p.image}" alt="${escapeHtml(p.title)}">`:`<div class="emoji-art" style="--bg1:${p.colors[0]};--bg2:${p.colors[1]}">${p.emoji}</div>`;
  const heart=saved.includes(p.id)?"\u2665":"\u2661";
  return `<article class="product-card" data-product-id="${p.id}" tabindex="0" role="link" aria-label="View ${escapeHtml(p.title)}"><div class="product-image">${art}<span class="condition-tag">${escapeHtml(p.condition)}</span><button class="save-button ${saved.includes(p.id)?"saved":""}" data-id="${p.id}" aria-label="Save ${escapeHtml(p.title)}">${heart}</button></div><div class="product-info"><div class="product-meta"><span>${escapeHtml(p.category)}</span><span>${escapeHtml(p.age)}</span></div><h3>${escapeHtml(p.title)}</h3><div class="product-bottom"><strong>${money(p.price)}</strong><span>&#8982; ${escapeHtml(p.location)}</span></div></div></article>`;
}

function bindProductCards(scope=document){
  scope.querySelectorAll(".product-card").forEach(card=>{
    card.onclick=e=>{if(!e.target.closest(".save-button"))openListing(Number(card.dataset.productId));};
    card.onkeydown=e=>{if((e.key==="Enter"||e.key===" ")&&!e.target.closest(".save-button")){e.preventDefault();openListing(Number(card.dataset.productId));}};
  });
  scope.querySelectorAll(".save-button").forEach(button=>button.onclick=e=>{e.stopPropagation();const id=Number(button.dataset.id);toggleSaved(id);button.classList.toggle("saved",saved.includes(id));button.textContent=saved.includes(id)?"\u2665":"\u2661";});
}

function renderProducts(){
  const list=filteredProducts();
  $("#resultCount").textContent=`${list.length} ${list.length===1?"listing":"listings"} available`;
  $("#productGrid").innerHTML=list.map(productCard).join("");
  $("#emptyState").hidden=Boolean(list.length);$("#productGrid").hidden=!list.length;
  bindProductCards($("#productGrid"));
}

function getProductDescription(p){
  if(p.description)return p.description;
  const copy={Books:"Clean copy with light signs of use. All pages are intact and it is ready for the next term.",Electronics:"Fully working and carefully used. You are welcome to check it at pickup before confirming.",Cycles:"Well maintained for everyday campus rides. Brakes and tyres are in working condition.","Room essentials":"A practical hostel-room essential in good working order, ready for immediate pickup.",Fashion:"Comfortable, clean, and gently used. A good fit for everyday campus wear."};
  return copy[p.category]||"Gently used and in the condition shown. Message the seller if you would like any more details.";
}

function sellerFor(p){
  const sellers=[{name:"Aarav Mehta",initials:"AM",program:"IPM '27"},{name:"Riya Shah",initials:"RS",program:"PGP '26"},{name:"Kabir Jain",initials:"KJ",program:"IPM '28"},{name:"Ananya Rao",initials:"AR",program:"PGP '27"}];
  return sellers[Math.abs(Number(p.id))%sellers.length];
}

function recommendationsFor(product){
  return products.filter(p=>p.id!==product.id).sort((a,b)=>{
    const categoryDifference=Number(a.category!==product.category)-Number(b.category!==product.category);
    return categoryDifference||Math.abs(a.price-product.price)-Math.abs(b.price-product.price);
  }).slice(0,4);
}

function openListing(id,updateHistory=true){
  const p=products.find(item=>item.id===id);if(!p){showMarketplace(false);return;}
  const seller=sellerFor(p);
  const art=p.image?`<img src="${p.image}" alt="${escapeHtml(p.title)}">`:`<div class="emoji-art" style="--bg1:${p.colors[0]};--bg2:${p.colors[1]}">${p.emoji}</div>`;
  const heart=saved.includes(p.id)?"\u2665":"\u2661";
  $("#detailContent").innerHTML=`<article class="listing-detail"><div class="detail-visual">${art}<span class="condition-tag">${escapeHtml(p.condition)}</span></div><div class="detail-copy"><div class="detail-breadcrumb">Marketplace&nbsp; / &nbsp;<span>${escapeHtml(p.category)}</span></div><h1>${escapeHtml(p.title)}</h1><div class="detail-subline"><span>Listed ${escapeHtml(p.age)}</span><i></i><span>Campus pickup only</span></div><div class="detail-price">${money(p.price)}</div><p class="detail-description">${escapeHtml(getProductDescription(p))}</p><div class="detail-facts"><div class="detail-fact"><small>Condition</small><strong>${escapeHtml(p.condition)}</strong></div><div class="detail-fact"><small>Pickup location</small><strong>${escapeHtml(p.location)}</strong></div></div><div class="seller-card"><span class="seller-avatar">${seller.initials}</span><div><b>${seller.name}</b><small>${seller.program} &middot; Usually replies quickly</small></div><span class="verified-badge">&#10003; IIMI verified</span></div><div class="detail-actions"><button class="primary-button" id="messageSeller" type="button">Message seller &rarr;</button><button class="detail-save ${saved.includes(p.id)?"saved":""}" id="detailSave" type="button" aria-label="Save listing">${heart}</button></div><p class="safe-note"><span>&#10003;</span> Meet in a public campus area and inspect before paying.</p></div></article>`;
  $("#recommendationGrid").innerHTML=recommendationsFor(p).map(productCard).join("");bindProductCards($("#recommendationGrid"));
  $("#detailSave").onclick=()=>{toggleSaved(p.id);openListing(p.id,false);};
  $("#messageSeller").onclick=()=>showToast(`Chat with ${seller.name.split(" ")[0]} will be available soon`);
  if(updateHistory)history.pushState({listingId:p.id},"",`#listing=${p.id}`);
  document.title=`${p.title} - Campus Cart`;showView("detail");
}

function showMarketplace(updateHistory=true){
  if(updateHistory)history.pushState({},"",location.pathname);
  document.title="Campus Cart - IIM Indore Marketplace";showView("buy");
}

function handleRoute(){
  const match=location.hash.match(/^#listing=(\d+)$/);
  if(match){openListing(Number(match[1]),false);return;}
  document.title="Campus Cart - IIM Indore Marketplace";showView(location.hash==="#sell"?"sell":"buy");
}

$("#backToMarket").onclick=()=>history.length>1?history.back():showMarketplace();
$("#browseAll").onclick=()=>showMarketplace();
document.querySelector(".brand").onclick=e=>{e.preventDefault();showMarketplace();};
document.querySelectorAll("[data-view]").forEach(button=>button.onclick=()=>{
  history.pushState({},"",button.dataset.view==="sell"?"#sell":location.pathname);
  showView(button.dataset.view);
});
window.addEventListener("popstate",handleRoute);
renderProducts();handleRoute();
