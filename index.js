const jewelleryContainer = document.getElementById("jewellery-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

let jewelleryList = [];
let cart = [];

// Fetch jewellery data from db.json
document.addEventListener("DOMContentLoaded", () => {
    fetchJewellery();
});

// Fetch jewellery items
async function fetchJewellery() {
    try {
        const response = await fetch('http://localhost:3000/jewellery');
        if (!response.ok) {
            throw new Error('Failed to fetch jewellery items');
        }
        jewelleryList = await response.json();
        displayJewellery(jewelleryList);
    } catch (error) {
        console.error(error);
    }
}

// Display jewellery items
function displayJewellery(items) {
    jewelleryContainer.innerHTML = ''; // Clear existing items
    items.forEach(item => {
        const jewelleryItem = document.createElement('div');
        jewelleryItem.classList.add('jewellery-item');

        // Ensure placeholder image if image key is missing
        const imageUrl = item.image ? item.image : 'placeholder.png';

        jewelleryItem.innerHTML = `
            <img src="${imageUrl}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Material:</strong> ${item.material}</p>
            <p><strong>Stones:</strong> ${item.stones.join(', ')}</p>
            <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
            <p><strong>Stock:</strong> ${item.stock}</p>
            <button class="add-to-cart" onclick="addToCart(${item.id})" ${item.stock === 0 ? 'disabled' : ''}>
                ${item.stock === 0 ? 'Sold Out' : 'Add to Cart'}
            </button>
        `;
        jewelleryContainer.appendChild(jewelleryItem);
    });
}

// Add item to cart
function addToCart(id) {
    const item = jewelleryList.find(jewellery => jewellery.id === id);
    if (item && item.stock > 0) {
        cart.push(item);
        item.stock -= 1; // Reduce stock by 1
        console.log(`${item.name} added to cart.`);
        displayJewellery(jewelleryList); // Refresh the UI
    } else {
        console.log('Item is out of stock.');
    }
}

// Search functionality
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    const filteredJewellery = jewelleryList.filter(item => {
        return (
            item.name.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.material.toLowerCase().includes(query) ||
            item.stones.some(stone => stone.toLowerCase().includes(query))
        );
    });
    displayJewellery(filteredJewellery);
});
