const dishes = [
 {id:1,name:"Burrata & Heirloom Tomato",category:"Starters",price:320,label:"CHEF'S PICK",description:"Creamy burrata, ripe tomatoes, basil oil and toasted sourdough.",image:"https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=85"},
 {id:2,name:"Wild Mushroom Crostini",category:"Starters",price:240,label:"VEGETARIAN",description:"Golden mushrooms, thyme, whipped ricotta and crisp country bread.",image:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=85"},
 {id:3,name:"Garden Herb Risotto",category:"Mains",price:460,label:"VEGETARIAN",description:"Slow-stirred rice, seasonal herbs and aged parmesan.",image:"https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=85"},
 {id:4,name:"Roasted Pepper Pasta",category:"Mains",price:390,label:"GUEST FAVOURITE",description:"Fresh pasta, roasted pepper sauce, basil and parmesan shavings.",image:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=85"},
 {id:5,name:"Slow-Roasted Signature Plate",category:"Mains",price:590,label:"SIGNATURE",description:"Chef's seasonal roast with vegetables and a rich house jus.",image:"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85"},
 {id:6,name:"Chocolate Fondant",category:"Desserts",price:260,label:"BESTSELLER",description:"Warm chocolate centre, vanilla cream and a delicate cocoa finish.",image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=85"},
 {id:7,name:"Seasonal Berry Tart",category:"Desserts",price:230,label:"SEASONAL",description:"Buttery pastry, vanilla custard and fresh seasonal berries.",image:"https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=85"},
 {id:8,name:"Citrus Garden Cooler",category:"Drinks",price:150,label:"REFRESHING",description:"Fresh citrus, mint and sparkling water over crushed ice.",image:"https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=800&q=85"},
 {id:9,name:"Velvet Cappuccino",category:"Drinks",price:130,label:"HOUSE CLASSIC",description:"Double espresso topped with silky steamed milk.",image:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=85"}
];
const money = amount => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(amount);
const menuGrid = document.querySelector("#menu-grid");
const searchInput = document.querySelector("#menu-search");
let activeCategory = "All";
let favourites = [];
try { favourites = JSON.parse(localStorage.getItem("dineoraFavourites") || "[]"); } catch { favourites = []; }
let cart = [];
try { cart = JSON.parse(sessionStorage.getItem("dineoraCart") || "[]"); } catch { cart = []; }

function renderMenu(){
 const query = searchInput.value.trim().toLowerCase();
 const filtered = dishes.filter(d => (activeCategory === "All" || d.category === activeCategory) && `${d.name} ${d.description} ${d.category}`.toLowerCase().includes(query));
 menuGrid.innerHTML = "";
 if(!filtered.length){menuGrid.innerHTML='<p class="empty-menu">No dishes found. Try another search or category.</p>';return;}
 filtered.forEach((d,i)=>{
  const card=document.createElement("article");card.className="dish-card";card.style.animationDelay=`${i*65}ms`;
  card.innerHTML=`<div class="dish-image"><img src="${d.image}" alt="${d.name}" loading="lazy"><span class="dish-label">${d.label}</span></div><div class="dish-content"><div class="dish-title-row"><h3></h3><span class="dish-price">${money(d.price)}</span></div><p></p><div class="dish-bottom"><span class="dish-category">${d.category}</span><div class="dish-actions"><button class="favourite-button ${favourites.includes(d.id) ? "is-favourite" : ""}" data-favourite="${d.id}" aria-label="Toggle favourite" aria-pressed="${favourites.includes(d.id)}">${favourites.includes(d.id) ? "♥" : "♡"}</button><button class="add-cart" data-add="${d.id}">＋ Add to order</button></div></div></div>`;
  card.querySelector("h3").textContent=d.name;card.querySelector(".dish-content p").textContent=d.description;menuGrid.appendChild(card);
 });
}
function saveCart(){try{sessionStorage.setItem("dineoraCart",JSON.stringify(cart));}catch{} updateCart();}
function updateCart(){
 const count=cart.reduce((sum,item)=>sum+item.quantity,0);
 const subtotal=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
 document.querySelector("#cart-count").textContent=count;
 document.querySelector("#cart-label").textContent=count===1?"1 item in your order":`${count} items in your order`;
 document.querySelector("#cart-subtotal").textContent=money(subtotal)+" subtotal";
 document.querySelector("#cart-dock").classList.toggle("visible",count>0);
}
function showToast(message){const toast=document.querySelector("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2600);}
document.querySelector("#menu-filters").addEventListener("click",event=>{const button=event.target.closest("[data-category]");if(!button)return;activeCategory=button.dataset.category;document.querySelectorAll(".filter").forEach(el=>el.classList.toggle("active",el===button));renderMenu();});
searchInput.addEventListener("input",renderMenu);
menuGrid.addEventListener("click",event=>{
 const favouriteButton=event.target.closest("[data-favourite]");
 if(favouriteButton){
  const id=Number(favouriteButton.dataset.favourite);
  favourites=favourites.includes(id)?favourites.filter(item=>item!==id):[...favourites,id];
  try{localStorage.setItem("dineoraFavourites",JSON.stringify(favourites));}catch{}
  renderMenu();showToast(favourites.includes(id)?"Added to your favourites":"Removed from favourites");return;
 }
 const button=event.target.closest("[data-add]");if(!button)return;
 const dish=dishes.find(d=>d.id===Number(button.dataset.add));const found=cart.find(item=>item.id===dish.id);
 if(found)found.quantity++;else cart.push({...dish,quantity:1});
 saveCart();button.classList.add("added");button.textContent="✓ Added";setTimeout(()=>{button.classList.remove("added");button.textContent="＋ Add to order";},900);
 showToast(`${dish.name} added to your order`);
});
document.querySelector("#checkout-button").addEventListener("click",()=>{if(!cart.length){showToast("Please add a dish first.");return;}window.location.href="bill.html";});
renderMenu();updateCart();

// Hero slider: automatically rotates and also supports manual controls.
const slides=[
 {image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=90",caption:"The art of slow dining",story:"01 — OUR STORY"},
 {image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=90",caption:"A table for every occasion",story:"02 — OUR SPACE"},
 {image:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=90",caption:"Seasonal flavours, made with care",story:"03 — FROM OUR KITCHEN"}
];
let slideIndex=0;const hero=document.querySelector(".hero");
function showSlide(index){slideIndex=(index+slides.length)%slides.length;hero.style.backgroundImage=`url("${slides[slideIndex].image}")`;document.querySelector("#slide-caption").textContent=slides[slideIndex].caption;document.querySelector("#slide-story").textContent=slides[slideIndex].story;document.querySelector("#slide-count").textContent=`${String(slideIndex+1).padStart(2,"0")} / ${String(slides.length).padStart(2,"0")}`;}
document.querySelector("#prev-slide").addEventListener("click",()=>showSlide(slideIndex-1));
document.querySelector("#next-slide").addEventListener("click",()=>showSlide(slideIndex+1));
let slideTimer=setInterval(()=>showSlide(slideIndex+1),6000);
hero.addEventListener("mouseenter",()=>clearInterval(slideTimer));
hero.addEventListener("mouseleave",()=>{clearInterval(slideTimer);slideTimer=setInterval(()=>showSlide(slideIndex+1),6000);});

// Reservation form confirmation
const bookingForm=document.querySelector("#booking-form");const bookingDate=document.querySelector("#booking-date");
const now=new Date();bookingDate.min=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
bookingForm.addEventListener("submit",event=>{event.preventDefault();const data=Object.fromEntries(new FormData(bookingForm).entries());document.querySelector("#booking-message").textContent=`Thank you, ${data.name}! Your demo reservation request for ${data.guests} guest(s) on ${data.date} at ${data.time} is confirmed on this page only.`;showToast("Demo reservation confirmation created.");bookingForm.reset();});

// Reviews carousel
const reviews=[
 {text:"“Beautiful atmosphere, thoughtful service, and every dish felt special. We stayed longer than planned.”",author:"— A happy guest"},
 {text:"“A lovely place for a celebration. The menu had something for everyone and the setting felt warm and relaxed.”",author:"— Weekend diner"},
 {text:"“The perfect spot for a slow dinner with friends. The little details made the evening memorable.”",author:"— Local food lover"}
];let reviewIndex=0;
function changeReview(direction){reviewIndex=(reviewIndex+direction+reviews.length)%reviews.length;const text=document.querySelector("#review-text");text.style.opacity=0;setTimeout(()=>{text.textContent=reviews[reviewIndex].text;document.querySelector("#review-author").textContent=reviews[reviewIndex].author;text.style.opacity=1;},180);}
document.querySelector("#review-prev").addEventListener("click",()=>changeReview(-1));document.querySelector("#review-next").addEventListener("click",()=>changeReview(1));
const menuToggle=document.querySelector("#menu-toggle");const navigation=document.querySelector("#navigation");
menuToggle.addEventListener("click",()=>{const open=navigation.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");});
navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{navigation.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");}));
document.querySelector("#year").textContent=new Date().getFullYear();

// Gentle scroll reveal for section intros
if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("in-view");observer.unobserve(entry.target);}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));}else{document.querySelectorAll(".reveal").forEach(el=>el.classList.add("in-view"));}

// Extra demo interactions: event enquiries, newsletter confirmation and back-to-top.
document.querySelectorAll(".event-enquiry").forEach(button=>button.addEventListener("click",()=>{
 const eventName=button.dataset.event;
 showToast(`Demo enquiry selected: ${eventName}. Please use the reservation form for your details.`);
 document.querySelector("#reservation").scrollIntoView({behavior:"smooth"});
 const occasion=document.querySelector('[name="occasion"]');
 if(occasion){const match=[...occasion.options].find(option=>option.text.toLowerCase().includes(eventName.toLowerCase().split(" ")[0]));if(match)occasion.value=match.value;}
}));
const newsletterForm=document.querySelector("#newsletter-form");
newsletterForm.addEventListener("submit",event=>{
 event.preventDefault();
 const email=document.querySelector("#newsletter-email").value.trim();
 document.querySelector("#newsletter-message").textContent=`Thanks! ${email} has been added to this demo guest list in this page only. No email was sent.`;
 newsletterForm.reset();showToast("Demo guest-list sign-up complete.");
});
const backToTop=document.querySelector("#back-to-top");
window.addEventListener("scroll",()=>backToTop.classList.toggle("visible",window.scrollY>500),{passive:true});
backToTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
