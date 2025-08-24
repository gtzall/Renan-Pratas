import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.161.0/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'https://unpkg.com/three@0.161.0/examples/jsm/environments/RoomEnvironment.js';

function webglAvailable(){
	try { const canvas = document.createElement('canvas'); return !!( window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) ); } catch(e){ return false; }
}

(function(){
	const $ = (sel, ctx=document) => ctx.querySelector(sel);
	const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

	let scene, camera, renderer, controls, mesh;
	let isZoomed = false;
	let isHovering = false;
	let hoverSpeed = 1;

	// Get product type from URL
	const urlParams = new URLSearchParams(window.location.search);
	const productType = urlParams.get('type') || 'ring';

	// Product data mapping
	const productData = {
		ring: {
			name: 'Anel Mirror Silver Premium',
			description: 'Anel de prata com acabamento espelhado e design minimalista. Cada curva foi cuidadosamente trabalhada para criar uma peça atemporal que combina elegância e modernidade.',
			price: 'R$ 890,00'
		},
		bracelet: {
			name: 'Pulseira Curve Luxe',
			description: 'Pulseira de prata com design fluido e orgânico. As linhas suaves criam um movimento visual que acompanha seus gestos com graça e sofisticação.',
			price: 'R$ 1.250,00'
		},
		chain: {
			name: 'Corrente Silver Link',
			description: 'Corrente de prata com elos entrelaçados criando um padrão único. O acabamento premium garante brilho duradouro e resistência ao tempo.',
			price: 'R$ 980,00'
		}
	};

	// Update product info
	function updateProductInfo() {
		const data = productData[productType] || productData.ring;
		$('#product-title').textContent = data.name;
		$('#product-description').textContent = data.description;
		$('#product-price').textContent = data.price;
	}

	// Create 3D scene
	function initScene() {
		// Scene setup
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x0a0b0c);
		
		// Camera setup
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(0, 0, 5);

		// Renderer setup
		renderer = new THREE.WebGLRenderer({ 
			canvas: $('#scene'), 
			antialias: true,
			alpha: true,
			powerPreference: "high-performance"
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.2;

		// Environment
		const environment = new THREE.RoomEnvironment(renderer);
		scene.environment = environment.environment;
		scene.fog = new THREE.Fog(0x0a0b0c, 10, 50);

		// Lighting
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(5, 5, 5);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 2048;
		directionalLight.shadow.mapSize.height = 2048;
		scene.add(directionalLight);

		// Point lights for dramatic effect
		const pointLight1 = new THREE.PointLight(0xcfd6dd, 0.8, 20);
		pointLight1.position.set(-3, 2, 3);
		scene.add(pointLight1);

		const pointLight2 = new THREE.PointLight(0x8aa0ff, 0.6, 15);
		pointLight2.position.set(3, -2, -3);
		scene.add(pointLight2);

		// Controls
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.enableZoom = true;
		controls.autoRotate = true;
		controls.autoRotateSpeed = 0.5;
		controls.maxDistance = 10;
		controls.minDistance = 2;

		// Create mesh based on product type
		createMesh(productType);

		// Add floating particles in the scene
		addFloatingParticles();

		// Event listeners
		setupEventListeners();

		// Start animation loop
		animate();

		// GSAP animations
		if (window.gsap) {
			initGSAPAnimations();
		}
	}

	// Create mesh based on product type
	function createMesh(type) {
		// Remove existing mesh
		if (mesh) scene.remove(mesh);

		// Material with metallic properties
		const metalMaterial = new THREE.MeshPhysicalMaterial({
			color: 0xcfd6dd,
			metalness: 0.9,
			roughness: 0.1,
			clearcoat: 0.3,
			clearcoatRoughness: 0.1,
			envMapIntensity: 1.2
		});

		switch(type) {
			case 'ring':
				mesh = new THREE.Mesh(
					new THREE.TorusGeometry(0.8, 0.22, 96, 220),
					metalMaterial
				);
				break;
			case 'bracelet':
				mesh = new THREE.Mesh(
					new THREE.TorusGeometry(1.2, 0.15, 64, 180),
					metalMaterial
				);
				break;
			case 'chain':
				// Create chain links
				const chainGroup = new THREE.Group();
				const linkGeometry = new THREE.TorusGeometry(0.3, 0.08, 32, 16);
				
				for (let i = 0; i < 8; i++) {
					const link = new THREE.Mesh(linkGeometry, metalMaterial);
					link.position.x = i * 0.6;
					link.rotation.z = i % 2 === 0 ? 0 : Math.PI / 2;
					chainGroup.add(link);
				}
				
				mesh = chainGroup;
				break;
			default:
				mesh = new THREE.Mesh(
					new THREE.TorusGeometry(0.8, 0.22, 96, 220),
					metalMaterial
				);
		}

		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add(mesh);

		// Add subtle glow effect
		const glowMaterial = new THREE.MeshBasicMaterial({
			color: 0xcfd6dd,
			transparent: true,
			opacity: 0.1
		});

		const glowGeometry = type === 'chain' ? 
			new THREE.BoxGeometry(5, 1, 1) : 
			new THREE.SphereGeometry(1.5, 32, 32);

		const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
		glowMesh.position.copy(mesh.position);
		scene.add(glowMesh);
	}

	// Add floating particles in the 3D scene
	function addFloatingParticles() {
		const particleCount = 50;
		const particles = new THREE.Group();

		for (let i = 0; i < particleCount; i++) {
			const geometry = new THREE.SphereGeometry(0.02, 8, 8);
			const material = new THREE.MeshBasicMaterial({
				color: 0xcfd6dd,
				transparent: true,
				opacity: Math.random() * 0.3 + 0.1
			});

			const particle = new THREE.Mesh(geometry, material);
			particle.position.set(
				(Math.random() - 0.5) * 20,
				(Math.random() - 0.5) * 20,
				(Math.random() - 0.5) * 20
			);

			particle.userData = {
				originalY: particle.position.y,
				speed: Math.random() * 0.02 + 0.01
			};

			particles.add(particle);
		}

		scene.add(particles);

		// Animate particles
		function animateParticles() {
			particles.children.forEach(particle => {
				particle.position.y += particle.userData.speed;
				if (particle.position.y > 10) {
					particle.position.y = -10;
				}
				particle.rotation.y += 0.01;
			});
		}

		// Store animation function for use in main loop
		window.animateParticles = animateParticles;
	}

	// Setup event listeners
	function setupEventListeners() {
		const canvas = $('#scene');
		
		// Mouse hover effects
		canvas.addEventListener('mouseenter', () => {
			isHovering = true;
			controls.autoRotateSpeed = 2;
		});

		canvas.addEventListener('mouseleave', () => {
			isHovering = false;
			controls.autoRotateSpeed = 0.5;
		});

		// Click to zoom
		canvas.addEventListener('click', () => {
			if (!isZoomed) {
				gsap.to(camera.position, {
					x: 0,
					y: 0,
					z: 2,
					duration: 1,
					ease: 'power2.inOut'
				});
				isZoomed = true;
			} else {
				gsap.to(camera.position, {
					x: 0,
					y: 0,
					z: 5,
					duration: 1,
					ease: 'power2.inOut'
				});
				isZoomed = false;
			}
		});

		// Window resize
		window.addEventListener('resize', onWindowResize, false);
	}

	// Window resize handler
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	// Animation loop
	function animate() {
		requestAnimationFrame(animate);

		// Update controls
		controls.update();

		// Animate particles if available
		if (window.animateParticles) {
			window.animateParticles();
		}

		// Subtle mesh animation
		if (mesh && isHovering) {
			mesh.rotation.y += 0.02;
		}

		// Render
		renderer.render(scene, camera);
	}

	// GSAP animations
	function initGSAPAnimations() {
		// Scene entrance animation
		gsap.from(camera.position, {
			z: 15,
			duration: 2,
			ease: 'power3.out'
		});

		// Mesh entrance
		if (mesh) {
			gsap.from(mesh.scale, {
				x: 0,
				y: 0,
				z: 0,
				duration: 1.5,
				ease: 'back.out(1.7)',
				delay: 0.5
			});
		}

		// Details entrance
		gsap.from('.details', {
			opacity: 0,
			y: 50,
			duration: 1,
			ease: 'power2.out',
			delay: 1
		});

		// Scroll-triggered rotation
		gsap.to(mesh.rotation, {
			y: Math.PI * 2,
			duration: 20,
			ease: 'none',
			scrollTrigger: {
				trigger: '.viewer',
				start: 'top top',
				end: 'bottom top',
				scrub: true
			}
		});
	}

	// Buy now functionality
	$('#buy-now').addEventListener('click', () => {
		if (window.Cart) {
			const item = {
				id: `product_${productType}_${Date.now()}`,
				name: productData[productType].name,
				price: productData[productType].price,
				type: productType,
				qty: 1
			};
			
			window.Cart.addItem(item);
			
			// Show success message
			const toast = $('#toast');
			toast.textContent = 'Adicionado ao carrinho!';
			toast.classList.add('show');
			
			setTimeout(() => {
				toast.classList.remove('show');
			}, 2000);
			
			// Redirect to checkout after a short delay
			setTimeout(() => {
				window.location.href = 'checkout.html';
			}, 1500);
		} else {
			alert('Carrinho não disponível');
		}
	});

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			updateProductInfo();
			initScene();
		});
	} else {
		updateProductInfo();
		initScene();
	}

})();

// Nav cart count
function updateCartCount(){
	const cnt = window.Cart?.getCount() || 0;
	const el = document.getElementById('cart-count');
	if (el) el.textContent = String(cnt);
}
window.Cart?.onChange(updateCartCount);
updateCartCount();

// Entrance animations
if (window.gsap) {
	gsap.from('#scene', { opacity: 0, duration: 0.8, ease: 'power2.out' });
	gsap.from('.details-inner', { opacity: 0, y: 24, duration: 0.9, delay: 0.15, ease: 'power2.out' });
}
