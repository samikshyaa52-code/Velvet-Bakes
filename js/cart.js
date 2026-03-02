/* Cart Logic - Velvet Bakes */
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

let cart = JSON.parse(localStorage.getItem('velvet_cart')) || [];

function saveCart() {
    localStorage.setItem('velvet_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function updateCartUI() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    const deliveryFee = parseInt(document.getElementById('delivery-option')?.value || 0);

    if (cartItemsElement) {
        cartItemsElement.innerHTML = cart.map(item => `
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
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCount) cartCount.innerText = totalCount;
    if (subtotalElement) subtotalElement.innerText = subtotal;
    if (totalElement) totalElement.innerText = subtotal > 0 ? subtotal + deliveryFee : 0;
}

function openCart() {
    document.getElementById('cart-sidebar').classList.add('active');
    document.getElementById('sidebar-overlay').classList.add('active');
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

function handleCheckout() {
    const name = document.getElementById('cust-name').value;
    const address = document.getElementById('cust-address').value;
    const notes = document.getElementById('cust-notes').value;
    const total = document.getElementById('cart-total').innerText;
    const deliveryOption = document.getElementById('delivery-option');
    const deliveryText = deliveryOption ? deliveryOption.options[deliveryOption.selectedIndex].text : 'N/A';

    if (cart.length === 0) {
        alert("Your basket is empty!");
        return;
    }
    if (!name || !address) {
        alert("Please fill in your name and address.");
        return;
    }

    let orderDetails = cart.map(item => `${item.name} x${item.quantity} (NPR ${item.price * item.quantity})`).join('\n');

    const message = `*Velvet Bakes Order*\n\n` +
        `*Customer:* ${name}\n` +
        `*Address:* ${address}\n\n` +
        `*Order Details:*\n${orderDetails}\n\n` +
        `*Delivery:* ${deliveryText}\n` +
        `*Grand Total:* NPR ${total}\n\n` +
        `*Notes:* ${notes || 'None'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/9779766822903?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', updateCartUI);
