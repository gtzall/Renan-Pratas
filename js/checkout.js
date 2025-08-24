(function(){
    console.log('checkout.js loaded');

    // Helper function to get DOM elements
    function $(selector) {
        return document.querySelector(selector);
    }

    // Helper function to get all DOM elements
    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    // Helper function to show toast notifications
    function showToast(message, type = 'info') {
        let toast = $('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    // Global variables
    let currentStep = 1;
    let currentTx = null;
    let polling = null;

    // Initialize checkout
    function init() {
        console.log('Initializing checkout...');
        renderCartItems();
        renderSummary();
        setupViaCEP();
        setupStepNavigation();
    }

    // Step navigation
    function setupStepNavigation() {
        // Add click handlers for step indicators
        $$('.step').forEach(step => {
            step.addEventListener('click', () => {
                const stepNumber = parseInt(step.dataset.step);
                if (stepNumber < currentStep) {
                    goToStep(stepNumber);
                }
            });
        });
    }

    function goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > 3) return;
        
        // Hide all step content with fade out
        $$('.step-content').forEach(content => {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            setTimeout(() => {
                content.style.display = 'none';
            }, 300);
        });
        
        // Show target step with fade in
        setTimeout(() => {
            const targetStep = $(`#step-${stepNumber}`);
            targetStep.style.display = 'block';
            targetStep.style.opacity = '0';
            targetStep.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                targetStep.style.transition = 'all 0.3s ease';
                targetStep.style.opacity = '1';
                targetStep.style.transform = 'translateY(0)';
            }, 10);
        }, 300);
        
        // Update step indicators with enhanced animations
        $$('.step').forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum === stepNumber) {
                step.classList.add('active');
                // Add pulse animation to active step
                step.style.animation = 'pulse 0.6s ease';
                setTimeout(() => {
                    step.style.animation = '';
                }, 600);
            } else if (stepNum < stepNumber) {
                step.classList.add('completed');
                // Add completion animation
                step.style.animation = 'bounce 0.5s ease';
                setTimeout(() => {
                    step.style.animation = '';
                }, 500);
            }
        });
        
        currentStep = stepNumber;
    }

    function nextStep() {
        if (currentStep === 1) {
            if (!validateCart()) {
                showToast('Adicione itens ao carrinho para continuar', 'error');
                return;
            }
        } else if (currentStep === 2) {
            if (!validateCustomerForm()) {
                showToast('Preencha todos os campos obrigatórios', 'error');
                return;
            }
        }
        
        if (currentStep < 3) {
            goToStep(currentStep + 1);
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    }

    // Validation functions
    function validateCart() {
        const cart = window.Cart?.get() || [];
        return cart.length > 0;
    }

    function validateCustomerForm() {
        const form = $('#customer-form');
        return form.checkValidity();
    }

    // Cart rendering
    function renderCartItems() {
        const cartItems = $('#cart-items');
        const cart = window.Cart?.get() || [];
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-icon">🛒</div>
                    <h3>Seu carrinho está vazio</h3>
                    <p>Adicione produtos para continuar</p>
                    <a href="index.html" class="btn-primary">Ver Produtos</a>
                </div>
            `;
            return;
        }
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-media">
                    ${item.type === 'ring' ? '💍' : item.type === 'bracelet' ? '💫' : '🔗'}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)" ${item.qty <= 1 ? 'disabled' : ''}>-</button>
                        <span class="quantity-display">${item.qty}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeItem('${item.id}')">Remover</button>
                </div>
            </div>
        `).join('');
    }

    function renderSummary() {
        const summaryItems = $('#summary-items');
        const subtotalEl = $('#subtotal');
        const totalEl = $('#total');
        
        const cart = window.Cart?.get() || [];
        const subtotal = window.Cart?.getTotal() || 0;
        const shipping = 0.00; // Frete grátis
        const total = subtotal + shipping;
        
        if (cart.length === 0) {
            summaryItems.innerHTML = '<p class="empty-summary">Nenhum item no carrinho</p>';
            subtotalEl.textContent = 'R$ 0,00';
            totalEl.textContent = 'R$ 0,00';
            return;
        }
        
        summaryItems.innerHTML = cart.map(item => `
            <div class="summary-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${item.price}</div>
                </div>
                <div class="item-qty">x${item.qty}</div>
            </div>
        `).join('');
        
        subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Cart manipulation functions
    function updateQuantity(itemId, change) {
        if (window.Cart) {
            const cart = window.Cart.get();
            const item = cart.find(i => i.id === itemId);
            
            if (item) {
                const newQty = item.qty + change;
                if (newQty > 0) {
                    window.Cart.updateQuantity(itemId, newQty);
                } else {
                    window.Cart.removeItem(itemId);
                }
                
                renderCartItems();
                renderSummary();
            }
        }
    }

    function removeItem(itemId) {
        if (window.Cart) {
            window.Cart.removeItem(itemId);
            renderCartItems();
            renderSummary();
            showToast('Item removido do carrinho');
        }
    }

    // ViaCEP integration
    function setupViaCEP() {
        const cepInput = $('#cep');
        if (cepInput) {
            cepInput.addEventListener('blur', async () => {
                const cep = cepInput.value.replace(/\D/g, '');
                if (cep.length === 8) {
                    try {
                        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                        const data = await response.json();
                        
                        if (!data.erro) {
                            $('#street').value = data.logradouro;
                            $('#neighborhood').value = data.bairro;
                            $('#city').value = data.localidade;
                            $('#state').value = data.uf;
                            showToast('Endereço preenchido automaticamente');
                        }
                    } catch (error) {
                        console.error('Erro ao buscar CEP:', error);
                    }
                }
            });
        }
    }

    // WhatsApp integration
    function finalizeWithWhatsApp() {
        const cart = window.Cart?.get() || [];
        const customerForm = $('#customer-form');
        
        if (cart.length === 0) {
            showToast('Adicione itens ao carrinho primeiro', 'error');
            return;
        }
        
        if (!customerForm.checkValidity()) {
            showToast('Preencha todos os dados obrigatórios', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(customerForm);
        const customerInfo = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            cep: formData.get('cep'),
            street: formData.get('street'),
            number: formData.get('number'),
            complement: formData.get('complement'),
            neighborhood: formData.get('neighborhood'),
            city: formData.get('city'),
            state: formData.get('state')
        };
        
        const total = (window.Cart?.getTotal() || 0) + 0.00; // Frete grátis
        
        // Send to WhatsApp
        if (window.sendToWhatsApp) {
            window.sendToWhatsApp(cart, customerInfo, `R$ ${total.toFixed(2).replace('.', ',')}`);
            showToast('Pedido enviado para WhatsApp!');
            
            // Clear cart after successful WhatsApp send
            setTimeout(() => {
                if (window.Cart) {
                    window.Cart.clear();
                    renderCartItems();
                    renderSummary();
                }
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showToast('Erro: função WhatsApp não disponível', 'error');
        }
    }

    // Pix payment functions
    function showPixPayment() {
        $('#pix-area').style.display = 'block';
        generatePix();
    }

    async function generatePix() {
        const cart = window.Cart?.get() || [];
        if (cart.length === 0) {
            showToast('Carrinho vazio', 'error');
            return;
        }
        
        const total = (window.Cart?.getTotal() || 0) + 0.00; // Frete grátis
        const description = `Pedido Renan Pratas - ${cart.length} item(s)`;
        
        try {
            const response = await fetch('http://localhost:3000/api/pix/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total.toFixed(2),
                    description: description
                })
            });
            
            const data = await response.json();
            
            if (data.ok) {
                $('#pix-qr').src = data.qrcodeDataUrl;
                $('#pix-qr').style.display = 'block';
                $('#pix-loading').style.display = 'none';
                $('#pix-code').value = data.payload;
                
                currentTx = data.txid;
                
                // Start polling for payment status
                if (polling) clearInterval(polling);
                polling = setInterval(checkPixStatus, 3000);
                
                showToast('Pix gerado com sucesso!');
            } else {
                throw new Error(data.error || 'Erro ao gerar Pix');
            }
        } catch (error) {
            console.error('Erro ao gerar Pix:', error);
            showToast('Erro ao gerar Pix: ' + error.message, 'error');
        }
    }

    async function checkPixStatus() {
        if (!currentTx) return;
        
        try {
            const response = await fetch(`http://localhost:3000/api/pix/status/${currentTx}`);
            const data = await response.json();
            
            if (data.ok && data.status === 'paid') {
                clearInterval(polling);
                showToast('Pagamento confirmado! Pedido finalizado.');
                
                // Clear cart and redirect
                setTimeout(() => {
                    if (window.Cart) {
                        window.Cart.clear();
                    }
                    window.location.href = 'index.html';
                }, 2000);
            }
        } catch (error) {
            console.error('Erro ao verificar status:', error);
        }
    }

    function copyPixCode() {
        const pixCode = $('#pix-code');
        pixCode.select();
        document.execCommand('copy');
        showToast('Código Pix copiado!');
    }

    // Make functions globally available
    window.nextStep = nextStep;
    window.prevStep = prevStep;
    window.updateQuantity = updateQuantity;
    window.removeItem = removeItem;
    window.finalizeWithWhatsApp = finalizeWithWhatsApp;
    window.showPixPayment = showPixPayment;
    window.copyPixCode = copyPixCode;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
