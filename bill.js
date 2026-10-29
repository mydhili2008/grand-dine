const money = amount => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",minimumFractionDigits:2,maximumFractionDigits:2}).format(amount);
let cart=[];
try{cart=JSON.parse(sessionStorage.getItem("dineoraCart")||"[]");}catch{cart=[];}
const itemsBox=document.querySelector("#bill-items");
const orderNumber="DIN-"+Math.random().toString(36).slice(2,6).toUpperCase()+"-"+Date.now().toString().slice(-5);
document.querySelector("#order-number").textContent=orderNumber;
document.querySelector("#order-date").textContent=new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
document.querySelector("#bill-year").textContent=new Date().getFullYear();
function renderBill(){
 itemsBox.innerHTML="";
 if(!cart.length){itemsBox.innerHTML='<div class="empty-bill"><p>Your order is empty.</p><a class="button button-dark" href="index.html#menu">Browse the menu →</a></div>';document.querySelector(".bill-totals").style.display="none";document.querySelector("#bill-edit-note").style.display="none";return;}
 document.querySelector(".bill-totals").style.display="grid";document.querySelector("#bill-edit-note").style.display="block";
 itemsBox.innerHTML='<div class="bill-table-head"><span>Item</span><span class="bill-qty">Qty</span><span class="bill-price">Amount</span></div>';
 cart.forEach(item=>{
  const row=document.createElement("div");row.className="bill-item";
  row.innerHTML='<div><span class="bill-item-name"></span><small></small><button class="remove-bill-item" type="button">Remove</button></div><div class="quantity-control"><button type="button" class="qty-minus" aria-label="Decrease quantity">−</button><span class="bill-qty-value"></span><button type="button" class="qty-plus" aria-label="Increase quantity">+</button></div><strong class="bill-price"></strong>';
  row.querySelector(".bill-item-name").textContent=item.name;row.querySelector("small").textContent=money(item.price)+" each";
  row.querySelector(".bill-qty-value").textContent=item.quantity;row.querySelector(".bill-price").textContent=money(item.price*item.quantity);
  row.querySelector(".qty-minus").addEventListener("click",()=>changeQuantity(item.id,-1));
  row.querySelector(".qty-plus").addEventListener("click",()=>changeQuantity(item.id,1));
  row.querySelector(".remove-bill-item").addEventListener("click",()=>{cart=cart.filter(entry=>entry.id!==item.id);saveCart();renderBill();});
  itemsBox.appendChild(row);
 });
 const subtotal=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
 const service=subtotal*.05;const tax=subtotal*.05;const total=subtotal+service+tax;
 document.querySelector("#subtotal").textContent=money(subtotal);
 document.querySelector("#service-charge").textContent=money(service);
 document.querySelector("#tax").textContent=money(tax);
 document.querySelector("#grand-total").textContent=money(total);
}
function saveCart(){try{sessionStorage.setItem("dineoraCart",JSON.stringify(cart));}catch{}}
function changeQuantity(id,change){const item=cart.find(entry=>entry.id===id);if(!item)return;item.quantity+=change;if(item.quantity<=0)cart=cart.filter(entry=>entry.id!==id);saveCart();renderBill();}
document.querySelector("#print-bill").addEventListener("click",()=>window.print());
document.querySelector("#new-order").addEventListener("click",()=>{window.location.href="index.html#menu";});
renderBill();
