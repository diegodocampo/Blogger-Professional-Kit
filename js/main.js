/* ============================================================
   NEUROPSIQUE - JAVASCRIPT PRINCIPAL
   Funcionalidades: Navegación móvil, Cookies, FAQ, Contacto,
   Blog dinámico, Newsletter, Scroll suave
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initCookieBanner();
    initFaqAccordion();
    initFaqFilters();
    initContactForm();
    initBlogSystem();
    initNewsletterForm();
    initSmoothScroll();
    initActiveNavOnScroll();
});

/* ========== NAVEGACIÓN MÓVIL ========== */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.getElementById('nav-list');
    
    if (!navToggle || !navList) return;
    
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navList.classList.toggle('nav-open');
        
        // Prevenir scroll cuando el menú está abierto
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
    
    // Cerrar menú al hacer clic en un enlace
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navList.classList.remove('nav-open');
            document.body.style.overflow = '';
        });
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList.classList.contains('nav-open')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navList.classList.remove('nav-open');
            document.body.style.overflow = '';
            navToggle.focus();
        }
    });
}

/* ========== BANNER DE COOKIES ========== */
function initCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieOverlay = document.getElementById('cookie-overlay');
    const btnAccept = document.getElementById('btn-accept-cookies');
    const btnReject = document.getElementById('btn-reject-cookies');
    
    if (!cookieBanner) return;
    
    // Comprobar si ya hay preferencia guardada
    const cookiePref = localStorage.getItem('neuropsique-cookies');
    
    if (cookiePref) {
        hideCookieBanner();
        return;
    }
    
    // Mostrar banner con pequeña animación
    setTimeout(() => {
        cookieBanner.classList.add('cookie-banner-visible');
        if (cookieOverlay) cookieOverlay.classList.add('cookie-overlay-visible');
    }, 500);
    
    // Aceptar todas
    btnAccept?.addEventListener('click', () => {
        localStorage.setItem('neuropsique-cookies', 'accepted');
        hideCookieBanner();
        // Aquí se puede activar Google Analytics, etc.
    });
    
    // Solo necesarias
    btnReject?.addEventListener('click', () => {
        localStorage.setItem('neuropsique-cookies', 'rejected');
        hideCookieBanner();
    });
    
    function hideCookieBanner() {
        cookieBanner.classList.remove('cookie-banner-visible');
        if (cookieOverlay) cookieOverlay.classList.remove('cookie-overlay-visible');
        
        setTimeout(() => {
            cookieBanner.style.display = 'none';
            if (cookieOverlay) cookieOverlay.style.display = 'none';
        }, 400);
    }
}

/* ========== ACORDEÓN FAQ ========== */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answerId = question.getAttribute('aria-controls');
            const answer = document.getElementById(answerId);
            
            // Cerrar todas las demás preguntas (comportamiento acordeón)
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    const otherAnswerId = q.getAttribute('aria-controls');
                    const otherAnswer = document.getElementById(otherAnswerId);
                    if (otherAnswer) otherAnswer.setAttribute('hidden', '');
                }
            });
            
            // Toggle pregunta actual
            question.setAttribute('aria-expanded', !isExpanded);
            if (isExpanded) {
                answer?.setAttribute('hidden', '');
            } else {
                answer?.removeAttribute('hidden');
                // Scroll suave hacia la respuesta
                setTimeout(() => {
                    answer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });
}

/* ========== FILTROS FAQ ========== */
function initFaqFilters() {
    const filterTabs = document.querySelectorAll('.faq-filters .filter-tab');
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!filterTabs.length || !faqItems.length) return;
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Actualizar tabs
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            // Filtrar preguntas
            faqItems.forEach(item => {
                if (category === 'todas' || item.getAttribute('data-category') === category) {
                    item.style.display = '';
                    // Animación sutil
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(10px)';
                    requestAnimationFrame(() => {
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/* ========== FORMULARIO DE CONTACTO ========== */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const reasonSelect = document.getElementById('reason');
    const messageInput = document.getElementById('message');
    const consentCheck = document.getElementById('consent');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    const successMsg = document.getElementById('form-success');
    const errorGlobal = document.getElementById('form-error-global');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpiar errores previos
        clearFormErrors();
        successMsg?.setAttribute('hidden', '');
        errorGlobal?.setAttribute('hidden', '');
        
        // Validar
        let isValid = true;
        
        if (!nameInput?.value.trim()) {
            showFieldError('name', 'Por favor, indica tu nombre completo.');
            isValid = false;
        } else if (nameInput.value.trim().length < 3) {
            showFieldError('name', 'El nombre debe tener al menos 3 caracteres.');
            isValid = false;
        }
        
        if (!emailInput?.value.trim()) {
            showFieldError('email', 'Por favor, indica tu correo electrónico.');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showFieldError('email', 'Por favor, introduce un email válido.');
            isValid = false;
        }
        
        if (!reasonSelect?.value) {
            showFieldError('reason', 'Por favor, selecciona un motivo de consulta.');
            isValid = false;
        }
        
        if (!messageInput?.value.trim()) {
            showFieldError('message', 'Por favor, escribe tu mensaje.');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showFieldError('message', 'El mensaje debe tener al menos 10 caracteres.');
            isValid = false;
        }
        
        if (!consentCheck?.checked) {
            showFieldError('consent', 'Debes aceptar la política de privacidad.');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Simular envío
        if (btnLoading) btnLoading.removeAttribute('hidden');
        if (btnText) btnText.setAttribute('hidden', '');
        submitBtn.disabled = true;
        
        try {
            // Simulamos una petición (aquí iría fetch a tu backend)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Éxito
            contactForm.reset();
            successMsg?.removeAttribute('hidden');
            successMsg?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Ocultar mensaje de éxito después de 8 segundos
            setTimeout(() => {
                successMsg?.setAttribute('hidden', '');
            }, 8000);
            
        } catch (error) {
            errorGlobal?.removeAttribute('hidden');
            errorGlobal?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } finally {
            if (btnLoading) btnLoading.setAttribute('hidden', '');
            if (btnText) btnText.removeAttribute('hidden');
            submitBtn.disabled = false;
        }
    });
    
    // Validación en tiempo real
    [nameInput, emailInput, messageInput].forEach(input => {
        input?.addEventListener('blur', () => {
            validateFieldOnBlur(input);
        });
        
        input?.addEventListener('input', () => {
            const errorEl = document.getElementById(`${input.id}-error`);
            if (errorEl?.textContent) {
                validateFieldOnBlur(input);
            }
        });
    });
    
    reasonSelect?.addEventListener('change', () => {
        const errorEl = document.getElementById('reason-error');
        if (errorEl?.textContent && reasonSelect.value) {
            errorEl.textContent = '';
            reasonSelect.classList.remove('input-error');
        }
    });
    
    consentCheck?.addEventListener('change', () => {
        const errorEl = document.getElementById('consent-error');
        if (errorEl?.textContent && consentCheck.checked) {
            errorEl.textContent = '';
        }
    });
}

function validateFieldOnBlur(input) {
    const errorEl = document.getElementById(`${input.id}-error`);
    if (!errorEl) return;
    
    if (input.id === 'name') {
        if (!input.value.trim()) {
            showFieldError('name', 'Por favor, indica tu nombre completo.');
        } else if (input.value.trim().length < 3) {
            showFieldError('name', 'El nombre debe tener al menos 3 caracteres.');
        } else {
            clearFieldError('name');
        }
    }
    
    if (input.id === 'email') {
        if (!input.value.trim()) {
            showFieldError('email', 'Por favor, indica tu correo electrónico.');
        } else if (!isValidEmail(input.value)) {
            showFieldError('email', 'Por favor, introduce un email válido.');
        } else {
            clearFieldError('email');
        }
    }
    
    if (input.id === 'message') {
        if (!input.value.trim()) {
            showFieldError('message', 'Por favor, escribe tu mensaje.');
        } else if (input.value.trim().length < 10) {
            showFieldError('message', 'El mensaje debe tener al menos 10 caracteres.');
        } else {
            clearFieldError('message');
        }
    }
}

function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (input) input.classList.add('input-error');
    if (errorEl) errorEl.textContent = message;
}

function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (input) input.classList.remove('input-error');
    if (errorEl) errorEl.textContent = '';
}

function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ========== SISTEMA DE BLOG DINÁMICO ========== */
function initBlogSystem() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;
    
    // Base de datos de publicaciones (simulada)
    // En un futuro se puede conectar a Firebase, Supabase o un CMS headless
    const publications = [
        {
            id: 1,
            title: '¿Qué es la neuroplasticidad y por qué es clave en la rehabilitación?',
            excerpt: 'La neuroplasticidad es la capacidad del cerebro para reorganizarse y crear nuevas conexiones neuronales a lo largo de la vida. Descubre cómo este mecanismo es fundamental en los procesos de rehabilitación cognitiva tras una lesión cerebral.',
            category: 'neuropsicologia',
            date: '2026-07-15',
            image: '🧠',
            readTime: '6 min',
            tags: ['neuroplasticidad', 'rehabilitación', 'cerebro']
        },
        {
            id: 2,
            title: 'Señales de alerta temprana del deterioro cognitivo: cuándo consultar',
            excerpt: 'Olvidos puntuales son normales, pero ciertos patrones pueden indicar un deterioro cognitivo que requiere evaluación. Te explico las señales de alerta que no debes ignorar y cuándo es recomendable acudir a un neuropsicólogo.',
            category: 'neuropsicologia',
            date: '2026-07-02',
            image: '🔍',
            readTime: '7 min',
            tags: ['deterioro cognitivo', 'memoria', 'diagnóstico']
        },
        {
            id: 3,
            title: 'Rehabilitación cognitiva tras un ictus: qué esperar y cómo afrontarlo',
            excerpt: 'El ictus es una de las principales causas de discapacidad adquirida. La rehabilitación neuropsicológica juega un papel crucial en la recuperación. Conoce las fases del proceso y las estrategias más efectivas.',
            category: 'rehabilitacion',
            date: '2026-06-20',
            image: '🔄',
            readTime: '8 min',
            tags: ['ictus', 'rehabilitación', 'daño cerebral']
        },
        {
            id: 4,
            title: 'El papel de la familia en la rehabilitación neuropsicológica',
            excerpt: 'La familia no es solo un apoyo emocional: es una pieza clave en el proceso de rehabilitación. Orientaciones prácticas para familiares y cuidadores de personas con dificultades cognitivas.',
            category: 'familia',
            date: '2026-06-08',
            image: '👨‍👩‍👧',
            readTime: '5 min',
            tags: ['familia', 'cuidadores', 'apoyo']
        },
        {
            id: 5,
            title: 'Nuevas investigaciones sobre marcadores tempranos del Alzheimer',
            excerpt: 'La detección precoz del Alzheimer es uno de los campos más activos en neurociencia. Repaso los últimos avances en biomarcadores y evaluación neuropsicológica para el diagnóstico temprano.',
            category: 'investigacion',
            date: '2026-05-25',
            image: '🔬',
            readTime: '9 min',
            tags: ['Alzheimer', 'investigación', 'biomarcadores']
        },
        {
            id: 6,
            title: 'TDAH en adultos: más allá de la infancia',
            excerpt: 'El Trastorno por Déficit de Atención e Hiperactividad no desaparece necesariamente en la edad adulta. Muchas personas conviven con él sin saberlo. Síntomas, evaluación y estrategias de manejo.',
            category: 'neuropsicologia',
            date: '2026-05-12',
            image: '📋',
            readTime: '7 min',
            tags: ['TDAH', 'adultos', 'atención']
        },
        {
            id: 7,
            title: 'Ejercicios prácticos de estimulación cognitiva para hacer en casa',
            excerpt: 'La estimulación cognitiva no solo se hace en consulta. Te propongo una serie de ejercicios prácticos que puedes realizar en tu día a día para mantener tu cerebro activo y saludable.',
            category: 'rehabilitacion',
            date: '2026-04-28',
            image: '🏠',
            readTime: '6 min',
            tags: ['estimulación cognitiva', 'ejercicios', 'prevención']
        },
        {
            id: 8,
            title: 'Cómo hablar con un familiar sobre sus problemas de memoria',
            excerpt: 'Abordar el tema de las dificultades cognitivas con un ser querido puede ser delicado. Estrategias de comunicación para tener conversaciones difíciles desde el respeto y la empatía.',
            category: 'familia',
            date: '2026-04-15',
            image: '💬',
            readTime: '5 min',
            tags: ['familia', 'comunicación', 'memoria']
        },
        {
            id: 9,
            title: 'Avances en neuroimagen: viendo el cerebro en acción',
            excerpt: 'Las técnicas de neuroimagen han revolucionado nuestra comprensión del cerebro. Un recorrido por las tecnologías más punteras y lo que nos revelan sobre el funcionamiento cognitivo.',
            category: 'investigacion',
            date: '2026-03-30',
            image: '📡',
            readTime: '8 min',
            tags: ['neuroimagen', 'tecnología', 'investigación']
        },
        {
            id: 10,
            title: 'El impacto del estrés crónico en las funciones cognitivas',
            excerpt: 'El estrés mantenido no solo afecta a nuestro bienestar emocional: tiene efectos medibles sobre la memoria, la atención y las funciones ejecutivas. Qué dice la ciencia y cómo proteger tu cerebro.',
            category: 'neuropsicologia',
            date: '2026-03-18',
            image: '😰',
            readTime: '6 min',
            tags: ['estrés', 'funciones ejecutivas', 'salud mental']
        },
        {
            id: 11,
            title: 'Guía para preparar la primera consulta de neuropsicología',
            excerpt: 'Si has decidido acudir a un neuropsicólogo, esta guía te ayudará a preparar la primera visita: qué documentación llevar, qué preguntas hacer y qué esperar de la sesión inicial.',
            category: 'familia',
            date: '2026-03-05',
            image: '📝',
            readTime: '5 min',
            tags: ['primera consulta', 'guía', 'neuropsicología']
        },
        {
            id: 12,
            title: 'Reserva cognitiva: el escudo protector de tu cerebro',
            excerpt: 'La reserva cognitiva explica por qué algunas personas toleran mejor el daño cerebral. Descubre qué es, cómo se construye a lo largo de la vida y qué hábitos la fortalecen.',
            category: 'investigacion',
            date: '2026-02-20',
            image: '🛡️',
            readTime: '7 min',
            tags: ['reserva cognitiva', 'prevención', 'envejecimiento']
        }
    ];
    
    // Guardar en localStorage para persistencia (permite añadir/eliminar)
    let storedPublications = localStorage.getItem('neuropsique-publications');
    if (!storedPublications) {
        localStorage.setItem('neuropsique-publications', JSON.stringify(publications));
    }
    
    // Estado
    let currentCategory = 'todas';
    let currentPage = 1;
    let postsPerPage = 6;
    let searchQuery = '';
    
    // Elementos DOM
    const filterTabs = document.querySelectorAll('.blog-filters .filter-tab');
    const searchInput = document.getElementById('blog-search-input');
    const searchResultsCount = document.getElementById('search-results-count');
    const blogEmpty = document.getElementById('blog-empty');
    const blogLoading = document.getElementById('blog-loading');
    const blogPagination = document.getElementById('blog-pagination');
    const btnPrevPage = document.getElementById('btn-prev-page');
    const btnNextPage = document.getElementById('btn-next-page');
    const paginationNumbers = document.getElementById('pagination-numbers');
    const btnResetFilters = document.getElementById('btn-reset-filters');
    
    // Renderizar publicaciones
    function renderPublications() {
        const allPublications = JSON.parse(localStorage.getItem('neuropsique-publications') || '[]');
        
        // Filtrar
        let filtered = allPublications;
        
        if (currentCategory !== 'todas') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.excerpt.toLowerCase().includes(query) ||
                (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }
        
        // Ordenar por fecha (más reciente primero)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Actualizar contador
        if (searchResultsCount) {
            if (searchQuery) {
                searchResultsCount.textContent = `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;
            } else {
                searchResultsCount.textContent = '';
            }
        }
        
        // Paginación
        const totalPages = Math.ceil(filtered.length / postsPerPage);
        const startIndex = (currentPage - 1) * postsPerPage;
        const paginatedPosts = filtered.slice(startIndex, startIndex + postsPerPage);
        
        // Mostrar/ocultar estados
        if (filtered.length === 0) {
            blogGrid.innerHTML = '';
            blogEmpty?.removeAttribute('hidden');
            blogPagination?.setAttribute('hidden', '');
        } else {
            blogEmpty?.setAttribute('hidden', '');
            
            // Renderizar posts
            blogGrid.innerHTML = paginatedPosts.map(post => `
                <article class="blog-card" data-category="${post.category}">
                    <div class="blog-card-image" aria-hidden="true">
                        <span class="blog-card-emoji">${post.image || '📄'}</span>
                        <span class="blog-card-category">${getCategoryName(post.category)}</span>
                    </div>
                    <div class="blog-card-content">
                        <div class="blog-card-meta">
                            <time datetime="${post.date}">${formatDate(post.date)}</time>
                            <span class="blog-card-readtime">${post.readTime || '5 min'} de lectura</span>
                        </div>
                        <h3 class="blog-card-title">
                            <a href="#">${post.title}</a>
                        </h3>
                        <p class="blog-card-excerpt">${post.excerpt}</p>
                        <div class="blog-card-footer">
                            <div class="blog-card-tags">
                                ${(post.tags || []).map(tag => `<span class="blog-tag">#${tag}</span>`).join(' ')}
                            </div>
                            <a href="#" class="blog-card-link" aria-label="Leer artículo completo: ${post.title}">
                                Leer más <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </article>
            `).join('');
            
            // Renderizar paginación
            if (totalPages > 1) {
                blogPagination?.removeAttribute('hidden');
                btnPrevPage.disabled = currentPage === 1;
                btnNextPage.disabled = currentPage === totalPages;
                
                paginationNumbers.innerHTML = '';
                for (let i = 1; i <= totalPages; i++) {
                    const pageBtn = document.createElement('button');
                    pageBtn.textContent = i;
                    pageBtn.classList.add('pagination-number');
                    if (i === currentPage) pageBtn.classList.add('active');
                    pageBtn.setAttribute('aria-label', `Ir a página ${i}`);
                    pageBtn.addEventListener('click', () => {
                        currentPage = i;
                        renderPublications();
                        blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                    paginationNumbers.appendChild(pageBtn);
                }
            } else {
                blogPagination?.setAttribute('hidden', '');
            }
        }
    }
    
    // Event Listeners
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            currentCategory = tab.getAttribute('data-category');
            currentPage = 1;
            renderPublications();
        });
    });
    
    // Búsqueda con debounce
    let searchTimeout;
    searchInput?.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = searchInput.value.trim();
            currentPage = 1;
            renderPublications();
        }, 300);
    });
    
    btnPrevPage?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPublications();
            blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
    
    btnNextPage?.addEventListener('click', () => {
        const allPublications = JSON.parse(localStorage.getItem('neuropsique-publications') || '[]');
        let filtered = filterPublications(allPublications);
        const totalPages = Math.ceil(filtered.length / postsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            renderPublications();
            blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
    
    btnResetFilters?.addEventListener('click', () => {
        currentCategory = 'todas';
        searchQuery = '';
        currentPage = 1;
        if (searchInput) searchInput.value = '';
        
        filterTabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        const allTab = document.getElementById('tab-todas');
        if (allTab) {
            allTab.classList.add('active');
            allTab.setAttribute('aria-selected', 'true');
        }
        
        renderPublications();
    });
    
    function filterPublications(allPublications) {
        let filtered = allPublications;
        if (currentCategory !== 'todas') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.excerpt.toLowerCase().includes(query) ||
                (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        return filtered;
    }
    
    // Render inicial
    renderPublications();
}

function getCategoryName(category) {
    const names = {
        'neuropsicologia': 'Neuropsicología',
        'rehabilitacion': 'Rehabilitación',
        'familia': 'Familia',
        'investigacion': 'Investigación'
    };
    return names[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

/* ========== NEWSLETTER ========== */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;
    
    const emailInput = document.getElementById('newsletter-email');
    const errorEl = document.getElementById('newsletter-error');
    const successEl = document.getElementById('newsletter-success');
    
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpiar estados
        if (errorEl) errorEl.textContent = '';
        successEl?.setAttribute('hidden', '');
        
        const email = emailInput?.value.trim();
        
        if (!email) {
            if (errorEl) errorEl.textContent = 'Por favor, introduce tu email.';
            return;
        }
        
        if (!isValidEmail(email)) {
            if (errorEl) errorEl.textContent = 'Por favor, introduce un email válido.';
            return;
        }
        
        // Simular envío
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
        }
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1200));
            
            // Éxito
            newsletterForm.reset();
            successEl?.removeAttribute('hidden');
            
            setTimeout(() => {
                successEl?.setAttribute('hidden', '');
            }, 6000);
            
        } catch (error) {
            if (errorEl) errorEl.textContent = 'Error al suscribir. Inténtalo de nuevo.';
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Suscribirme';
            }
        }
    });
}

/* ========== SCROLL SUAVE PARA ANCLAS ========== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Mover foco al elemento destino para accesibilidad
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });
}

/* ========== NAVEGACIÓN ACTIVA AL HACER SCROLL ========== */
function initActiveNavOnScroll() {
    // Solo para la página de inicio (hero con secciones)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;
    
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            
            // No modificar la clase active aquí porque ya se gestiona por página
            // Esto sería útil si todas las secciones estuvieran en una sola página
        }, 100);
    }, { passive: true });
}

/* ========== FUNCIONES PARA EL PANEL DE ADMINISTRACIÓN (Futuro) ========== */
// Estas funciones están preparadas para cuando se implemente admin.html

function addPublication(publication) {
    const publications = JSON.parse(localStorage.getItem('neuropsique-publications') || '[]');
    publication.id = Date.now();
    publication.date = new Date().toISOString().split('T')[0];
    publications.unshift(publication);
    localStorage.setItem('neuropsique-publications', JSON.stringify(publications));
    return publication;
}

function deletePublication(id) {
    let publications = JSON.parse(localStorage.getItem('neuropsique-publications') || '[]');
    publications = publications.filter(p => p.id !== id);
    localStorage.setItem('neuropsique-publications', JSON.stringify(publications));
}

function getPublications() {
    return JSON.parse(localStorage.getItem('neuropsique-publications') || '[]');
}

/* ========== DETECCIÓN DE PÁGINA ACTUAL ========== */
console.log('🧠 NeuroPsique - JavaScript cargado correctamente');
console.log('📄 Página actual:', document.title);
