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
