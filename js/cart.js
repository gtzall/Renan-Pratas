(function(){
	const CART_KEY = 'renan_pratas_cart';
	
	// Cart management functions
	function getCart() {
		try {
			return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
		} catch (e) {
			console.error('Erro ao ler carrinho:', e);
			return [];
		}
	}
	
	function saveCart(cart) {
		try {
			localStorage.setItem(CART_KEY, JSON.stringify(cart));
			// Trigger change event
			if (window.Cart && window.Cart.onChange) {
				window.Cart.onChange(cart);
			}
		} catch (e) {
			console.error('Erro ao salvar carrinho:', e);
		}
	}
	
	function addItem(item) {
		const cart = getCart();
		const existingItem = cart.find(i => i.id === item.id);
		
		if (existingItem) {
			existingItem.qty = (existingItem.qty || 1) + (item.qty || 1);
		} else {
			cart.push({
				...item,
				qty: item.qty || 1,
				addedAt: new Date().toISOString()
			});
		}
		
		saveCart(cart);
		return cart;
	}
	
	function removeItem(itemId) {
		const cart = getCart();
		const filteredCart = cart.filter(i => i.id !== itemId);
		saveCart(filteredCart);
		return filteredCart;
	}
	
	function updateQuantity(itemId, newQty) {
		const cart = getCart();
		const item = cart.find(i => i.id === itemId);
		
		if (item) {
			if (newQty <= 0) {
				return removeItem(itemId);
			} else {
				item.qty = newQty;
				item.updatedAt = new Date().toISOString();
				saveCart(cart);
				return cart;
			}
		}
		
		return cart;
	}
	
	function clear() {
		localStorage.removeItem(CART_KEY);
		if (window.Cart && window.Cart.onChange) {
			window.Cart.onChange([]);
		}
		return [];
	}
	
	function getCount() {
		const cart = getCart();
		return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
	}
	
	function getTotal() {
		const cart = getCart();
		return cart.reduce((sum, item) => {
			const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
			return sum + (price * (item.qty || 1));
		}, 0);
	}
	
	// Expose cart API
	window.Cart = {
		get: getCart,
		addItem,
		removeItem,
		updateQuantity,
		clear,
		getCount,
		getTotal,
		onChange: null
	};
	
})();
