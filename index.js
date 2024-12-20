const jewelleryList = document.getElementById("jewellery");
const cartList = document.getElementById("cart");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const searchBar = document.getElementById("search-bar");

let cart = [];
let jewelleryItems = [];

// Create a jewellery item in the menu
function createJewelleryMenuItem(jewellery) {
  const li = document.createElement("li");
  li.classList.add("jewellery-item");

  const img = document.createElement("img");
  img.src = jewellery.image;
  img.alt = jewellery.name;

  const name = document.createElement("h3");
  name.textContent = jewellery.name;

  const price = document.createElement("p");
  price.textContent = `$${jewellery.price.toFixed(2)}`;

  const stock = document.createElement("p");
  stock.textContent = `Stock: ${jewellery.stock}`;
  stock.classList.add(jewellery.stock === 0 ? "sold-out" : "in-stock");

  const category = document.createElement("p");
  category.textContent = `Category: ${jewellery.category}`;

  const material = document.createElement("p");
  material.textContent = `Material: ${jewellery.material}`;

  const stones = document.createElement("p");
  stones.textContent = `Stones: ${jewellery.stones.join(", ")}`;

  const addToCartBtn = document.createElement("button");
  addToCartBtn.textContent = "Add to Cart";
  addToCartBtn.disabled = jewellery.stock === 0; // Disable if sold out
  addToCartBtn.addEventListener("click", () => addToCart(jewellery, addToCartBtn, stock));

  li.appendChild(img);
  li.appendChild(name);
  li.appendChild(price);
  li.appendChild(stock);
  li.appendChild(category);
  li.appendChild(material);
  li.appendChild(stones);
  li.appendChild(addToCartBtn);

  jewelleryList.appendChild(li);
}

// Fetch jewellery data and display it
fetch("http://localhost:3000/jewellery")
  .then(response => response.json())
  .then(data => {
    jewelleryItems = data;
    displayJewelleryItems(jewelleryItems); // Display all items initially
  })
  .catch(error => console.error('Error fetching jewellery:', error));

// Function to display jewellery items based on a list
function displayJewelleryItems(items) {
  jewelleryList.innerHTML = "";
  items.forEach(item => createJewelleryMenuItem(item));
}

// Add item to cart
function addToCart(jewellery, addToCartBtn, stock) {
  const existingItem = cart.find(item => item.id === jewellery.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...jewellery, quantity: 1 });
  }

  // Decrease the stock of the item
  jewellery.stock--;
  updateCart();
  
  // Update the jewellery item display
  updateJewelleryDisplay(jewellery, addToCartBtn, stock);
}

// Remove item from cart
function removeFromCart(itemId) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    // Increase the stock back when removed from the cart
    const jewellery = jewelleryItems.find(j => j.id === itemId);
    jewellery.stock += item.quantity;
  }
  cart = cart.filter(item => item.id !== itemId);
  updateCart();
}

// Update the jewellery item display
function updateJewelleryDisplay(jewellery, addToCartBtn, stock) {
  const jewelleryItem = jewelleryItems.find(item => item.id === jewellery.id);
  
  // Update the stock and disable the "Add to Cart" button if out of stock
  if (jewelleryItem.stock === 0) {
    stock.textContent = "Sold Out";
    stock.classList.add("sold-out");
    addToCartBtn.disabled = true;
  } else {
    stock.textContent = `Stock: ${jewelleryItem.stock}`;
    stock.classList.remove("sold-out");
    addToCartBtn.disabled = false;
  }
}

// Update the cart display
function updateCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = `${item.name} (x${item.quantity})`;

    const price = document.createElement("span");
    price.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeFromCart(item.id));

    li.appendChild(name);
    li.appendChild(price);
    li.appendChild(removeBtn);

    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  checkoutBtn.disabled = cart.length === 0;
}

// Checkout button click handler
checkoutBtn.addEventListener("click", () => {
  alert("Thank you for your purchase!");
  cart = [];
  updateCart();
});

// Filter jewellery items based on search query
function filterJewellery(query) {
  const filteredItems = jewelleryItems.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );
  displayJewelleryItems(filteredItems);
}

// Add event listener to search bar
searchBar.addEventListener("input", (event) => {
  const query = event.target.value;
  filterJewellery(query);
});
