// ==================== CONFIGURACIÓN INICIAL ====================
const API_URL = 'https://fakestoreapi.com/products?limit=8';
let cart = [];
let products = [];

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    fetchProducts();
    setupEventListeners();
    updateCartUI();
});

// ==================== FETCH API - OBTENER PRODUCTOS ====================
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al cargar los productos. Por favor, intenta nuevamente.', 'error');
    }
}

// ==================== MOSTRAR PRODUCTOS ====================
function displayProducts(productsArray) {
    const productCardsContainer = document.querySelector('.product-cards');
    if (!productCardsContainer) return;

    productCardsContainer.innerHTML = '';

    productsArray.forEach(product => {
        const card = createProductCard(product);
        productCardsContainer.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'card api-card';
    card.innerHTML = `
        <h3>${truncateText(product.title, 50)}</h3>
        <div class="card-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <p class="product-description">${truncateText(product.description, 80)}</p>
        <p class="product-price">Precio: $${product.price.toFixed(2)}</p>
        <button class="button add-to-cart-btn" data-id="${product.id}">
            Agregar al Carrito
        </button>
    `;

    const button = card.querySelector('.add-to-cart-btn');
    button.addEventListener('click', () => addToCart(product));

    return card;
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// ==================== CARRITO DE COMPRAS ====================
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartUI();
    showMessage(`${product.title} agregado al carrito`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
    showMessage('Producto eliminado del carrito', 'info');
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCartToStorage();
            updateCartUI();
        }
    }
}

function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartUI();
    showMessage('Carrito vaciado', 'info');
}

// ==================== ACTUALIZAR UI DEL CARRITO ====================
function updateCartUI() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.getElementById('total-price');

    if (!cartItemsContainer || !totalPriceElement) return;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        totalPriceElement.textContent = '0.00';
        updateCartCounter();
        return;
    }

    cart.forEach(item => {
        const cartItem = createCartItem(item);
        cartItemsContainer.appendChild(cartItem);
    });

    const total = calculateTotal();
    totalPriceElement.textContent = total.toFixed(2);
    updateCartCounter();

    // Agregar botón para vaciar carrito
    const clearButton = document.createElement('button');
    clearButton.className = 'button clear-cart-btn';
    clearButton.textContent = 'Vaciar Carrito';
    clearButton.addEventListener('click', clearCart);
    cartItemsContainer.appendChild(clearButton);
}

function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
            <h4>${truncateText(item.title, 40)}</h4>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            <div class="quantity-controls">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <input type="number" 
                       class="quantity-input" 
                       value="${item.quantity}" 
                       min="1" 
                       data-id="${item.id}">
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <p class="cart-item-subtotal">Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <button class="remove-btn" data-id="${item.id}">×</button>
    `;

    // Event listeners para controles de cantidad
    const decreaseBtn = cartItem.querySelector('.decrease');
    const increaseBtn = cartItem.querySelector('.increase');
    const quantityInput = cartItem.querySelector('.quantity-input');
    const removeBtn = cartItem.querySelector('.remove-btn');

    decreaseBtn.addEventListener('click', () => {
        updateQuantity(item.id, item.quantity - 1);
    });

    increaseBtn.addEventListener('click', () => {
        updateQuantity(item.id, item.quantity + 1);
    });

    quantityInput.addEventListener('change', (e) => {
        const newQuantity = parseInt(e.target.value) || 1;
        updateQuantity(item.id, newQuantity);
    });

    removeBtn.addEventListener('click', () => {
        removeFromCart(item.id);
    });

    return cartItem;
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartCounter() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Actualizar o crear contador en el header
    let counter = document.querySelector('.cart-counter');
    if (!counter) {
        counter = document.createElement('span');
        counter.className = 'cart-counter';
        const header = document.querySelector('.header_nav');
        if (header) {
            header.appendChild(counter);
        }
    }
    
    counter.textContent = `Carrito (${totalItems})`;
    counter.style.display = totalItems > 0 ? 'inline' : 'none';
}

// ==================== LOCAL STORAGE ====================
function saveCartToStorage() {
    try {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (error) {
        console.error('Error al cargar desde localStorage:', error);
        cart = [];
    }
}

// ==================== VALIDACIÓN DE FORMULARIOS ====================
function setupEventListeners() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Event listeners para los botones estáticos
    const staticButtons = document.querySelectorAll('.productos .button');
    staticButtons.forEach(button => {
        button.addEventListener('click', handleStaticProductClick);
    });
}

function handleStaticProductClick(e) {
    const card = e.target.closest('.card');
    const title = card.querySelector('h3').textContent;
    const priceText = card.querySelector('p:last-of-type').textContent;
    const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ''));

    const staticProduct = {
        id: `static-${title}`,
        title: title,
        price: price,
        image: card.querySelector('img').src,
        quantity: 1
    };

    addToCart(staticProduct);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const errors = validateForm(formData, form);

    // Limpiar errores previos
    clearFormErrors(form);

    if (errors.length > 0) {
        displayFormErrors(form, errors);
        showMessage('Por favor, corrige los errores en el formulario', 'error');
        return false;
    }

    // Si el formulario es válido
    showMessage('Formulario enviado exitosamente', 'success');
    form.reset();
    return true;
}

function validateForm(formData, form) {
    const errors = [];

    // Validar campos requeridos
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            errors.push({
                field: field.name,
                message: `El campo ${field.name} es requerido`
            });
        }
    });

    // Validar email
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !validateEmail(field.value)) {
            errors.push({
                field: field.name,
                message: 'El formato del correo electrónico no es válido'
            });
        }
    });

    return errors;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function clearFormErrors(form) {
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const errorFields = form.querySelectorAll('.error-field');
    errorFields.forEach(field => field.classList.remove('error-field'));
}

function displayFormErrors(form, errors) {
    errors.forEach(error => {
        const field = form.querySelector(`[name="${error.field}"]`);
        if (field) {
            field.classList.add('error-field');
            
            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = error.message;
            field.parentNode.insertBefore(errorMsg, field.nextSibling);
        }
    });
}

// ==================== MENSAJES AL USUARIO ====================
function showMessage(message, type = 'info') {
    // Remover mensaje anterior si existe
    const existingMessage = document.querySelector('.toast-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Mostrar el mensaje
    setTimeout(() => toast.classList.add('show'), 10);

    // Ocultar y remover después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== UTILIDADES ====================
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
}

// ==================== FUNCIONES ADICIONALES PARA BOTONES ESTÁTICOS ====================
// Para los botones del HTML estático
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('button') && 
        e.target.textContent.includes('Agregar al Carrito') &&
        !e.target.hasAttribute('onclick')) {
        
        const card = e.target.closest('.card');
        const title = card.querySelector('h3').textContent;
        const priceText = card.querySelector('p:last-of-type').textContent;
        const price = parseFloat(priceText.replace(/[^0-9]/g, ''));
        const imgSrc = card.querySelector('img').src;
        
        const staticProduct = {
            id: Date.now(),
            title: title,
            price: price,
            image: imgSrc
        };
        
        const existingItem = cart.find(item => item.title === staticProduct.title);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...staticProduct,
                quantity: 1
            });
        }
        
        showMessage(`${staticProduct.title} agregado al carrito`, 'success');
        saveCartToStorage();
        renderCart();
        updateCartCounter();
        animateCartIcon();
    }
});