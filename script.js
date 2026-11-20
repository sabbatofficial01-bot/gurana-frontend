
const API_URL = "https://gurana-backend.ethiodeploy.app";

let cart = [];

const products = [
    {
        id: 1,
        name: "Rice",
        price: 1500,
        description: "Quality rice for your family."
    },
    {
        id: 2,
        name: "Cooking Oil",
        price: 3000,
        description: "Good quality cooking oil."
    },
    {
        id: 3,
        name: "Beans",
        price: 1200,
        description: "Fresh and quality beans."
    },
    {
        id: 4,
        name: "Sugar",
        price: 1800,
        description: "Quality sugar for everyday use."
    }
];

// DISPLAY PRODUCTS
function displayProducts() {
    const productList = document.getElementById("product-list");

    productList.innerHTML = "";

    products.forEach(product => {
        productList.innerHTML += `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>${product.price} RWF</strong></p>
                <button class="btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

// ADD PRODUCT TO CART
function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

// UPDATE CART
function updateCart() {
    const cartItems = document.getElementById("cart-items");

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>${item.price * item.quantity} RWF</span>
            </div>
        `;
    });

    document.getElementById("cart-total").textContent = total;
    document.getElementById("cart-count").textContent = count;
}

// CHECKOUT AND SAVE ORDERS
document.getElementById("checkout-form")
.addEventListener("submit", async function(event) {

    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const button = this.querySelector("button[type='submit']");
    button.disabled = true;
    button.textContent = "Processing...";

    const order = {
        customerName: document.getElementById("customerName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        paymentMethod: document.getElementById("paymentMethod").value,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        )
    };

    try {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Order submission failed");
        }

        document.getElementById("message").textContent =
            `Order successful! Your order number is ${result.orderNumber}`;

        cart = [];
        updateCart();
        this.reset();

    } catch (error) {
        console.error("Checkout error:", error);

        document.getElementById("message").textContent =
            "Order failed. Please try again.";

    } finally {
        button.disabled = false;
        button.textContent = "Place Order";
    }
});

// START WEBSITE
displayProducts();
updateCart();
