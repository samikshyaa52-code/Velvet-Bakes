/* 
   Velvet Bakes - Unified Logic 
   Handles: Nav, Cart, WhatsApp, UI Interactions
*/

// --- Product Database ---
const products = [
    { id: 1, name: "Jaggery Spice Cupcake", price: 100, img: "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=600&q=80", nutrition: "High Fiber, Low Sugar" },
    { id: 2, name: "Dark Cocoa Cake", price: 1500, img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80", nutrition: "70% Dark Cocoa, No Maida" },
    { id: 3, name: "Honey Atta Cupcake", price: 120, img: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80", nutrition: "Pure Honey, Whole Wheat" },
    { id: 4, name: "Apple Cinnamon Cupcake", price: 140, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80", nutrition: "Fresh Apples, High Fiber" },
    { id: 5, name: "Peanut Butter Brownie", price: 200, img: "images/Peanut-Butter-Brownies.jpg", nutrition: "Protein Rich, Whole Grain" },
    { id: 6, name: "Whole Wheat Sourdough", price: 250, img: "images/whole-wheat-sourdough-bread-slices-wooden-board.jpg", nutrition: "Local Atta, Slow Fermented" },
    { id: 7, name: "Oatmeal Raisin Cookie", price: 80, img: "images/oatmeal-raisin-cookies-recipe.avif", nutrition: "No Refined Sugar" },
    { id: 8, name: "Saffron Spiced Cake", price: 1800, img: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=600&q=80", nutrition: "Pure Saffron, Whole Nut" },
    { id: 9, name: "Blueberry Atta Muffin", price: 150, img: "images/blueberrymuffins.webp", nutrition: "Antioxidant Rich" },
    { id: 10, name: "Banana Walnut Bread", price: 400, img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80", nutrition: "Potassium Rich, Fiber Packed" },
    { id: 11, name: "Almond Crunch Brownie", price: 220, img: "https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&w=600&q=80", nutrition: "Heart Healthy Fats" },
    { id: 12, name: "Signature Wheat Loaf", price: 180, img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80", nutrition: "Stone Ground, Zero Maida" }
];

// --- State ---
let cart = JSON.parse(localStorage.getItem('velvet_cart')) || [];

// --- Page & UI Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initCart();
    renderPageSpecifics();
    initSmoothScroll();
    initCountdown();
});

// --- Navigation Logic ---
function initNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
}

// --- Cart Logic ---
function initCart() {
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('velvet_cart', JSON.stringify(cart));
    updateCartUI();
}

window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    openCart();
};

window.removeFromCart = function (productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
};

window.toggleCart = function () {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
};

function openCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    }
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const delivery = parseInt(document.getElementById('delivery-option')?.value || 0);

    if (cartItems) {
        cartItems.innerHTML = cart.length === 0 ? '<p class="text-center" style="margin-top:20px;">Your basket is empty.</p>' :
            cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name} (x${item.quantity})</h4>
                    <p>NPR ${item.price * item.quantity}</p>
                </div>
                <span class="remove-item" onclick="removeFromCart(${item.id})">Remove</span>
            </div>
        `).join('');
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCount) cartCount.innerText = count;
    if (subtotalEl) subtotalEl.innerText = subtotal;
    if (totalEl) totalEl.innerText = subtotal > 0 ? subtotal + delivery : 0;
}

window.handleCheckout = function () {
    const name = document.getElementById('cust-name').value;
    const address = document.getElementById('cust-address').value;
    const notes = document.getElementById('cust-notes').value;
    const total = document.getElementById('cart-total').innerText;
    const deliveryOption = document.getElementById('delivery-option');
    const deliveryText = deliveryOption ? deliveryOption.options[deliveryOption.selectedIndex].text : 'N/A';

    if (cart.length === 0) return alert("Basket is empty!");
    if (!name || !address) return alert("Fill in Name and Address.");

    let orderLines = cart.map(item => `- ${item.name} x${item.quantity} (NPR ${item.price * item.quantity})`).join('\n');

    const msg = `*Velvet Bakes Order*\n\n` +
        `*Customer:* ${name}\n` +
        `*Address:* ${address}\n\n` +
        `*Items:*\n${orderLines}\n\n` +
        `*Delivery:* ${deliveryText}\n` +
        `*Grand Total:* NPR ${total}\n\n` +
        `*Notes:* ${notes || 'None'}`;

    window.open(`https://wa.me/9779766822903?text=${encodeURIComponent(msg)}`, '_blank');
};

// --- Page Specific Rendering ---
function renderPageSpecifics() {
    // Menu Page
    const menuContainer = document.getElementById('menu-container');
    if (menuContainer) {
        menuContainer.innerHTML = products.map(p => `
            <div class="product-card">
                <div class="product-img">
                    <img src="${p.img}" alt="${p.name}">
                </div>
                <div class="product-info">
                    <span class="nutrition-tag">${p.nutrition}</span>
                    <h3>${p.name}</h3>
                    <p style="color:var(--white); margin: 10px 0; font-weight:600;">NPR ${p.price}</p>
                    <button class="btn-premium" onclick="addToCart(${p.id})">Add to Basket</button>
                </div>
            </div>
        `).join('');
    }
}

// --- Custom Cake Inquiry ---
window.sendCustomInquiry = function () {
    const flavor = document.getElementById('cake-flavor').value;
    const weight = document.getElementById('cake-weight').value;
    const message = document.getElementById('cake-message').value;
    const date = document.getElementById('event-date').value;
    const notes = document.getElementById('design-notes').value;

    if (!date) return alert("Select occasion date.");

    const text = `*Custom Cake Inquiry*\n\n` +
        `*Flavor:* ${flavor}\n` +
        `*Weight:* ${weight}\n` +
        `*Message:* ${message || 'None'}\n` +
        `*Date:* ${date}\n` +
        `*Design Notes:* ${notes || 'None'}`;

    window.open(`https://wa.me/9779766822903?text=${encodeURIComponent(text)}`, '_blank');
};

// --- Contact Inquiry ---
window.sendContactEnquiry = function () {
    const name = document.getElementById('enq-name').value;
    const email = document.getElementById('enq-email').value;
    const subject = document.getElementById('enq-subject').value;
    const message = document.getElementById('enq-message').value;

    if (!name || !email || !message) return alert("Fill required fields.");

    const text = `*Website Enquiry*\n\n` +
        `*From:* ${name} (${email})\n` +
        `*Subject:* ${subject || 'General'}\n` +
        `*Message:* ${message}`;

    window.open(`https://wa.me/9779766822903?text=${encodeURIComponent(text)}`, '_blank');
};

// --- Helpers ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function initCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    let time = 172800; // 48h
    setInterval(() => {
        if (time <= 0) return;
        time--;
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = time % 60;
        el.innerText = `${h}h ${m}m ${s}s`;
    }, 1000);
}
