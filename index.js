// Sistema de Abas para Apresentação
document.addEventListener('DOMContentLoaded', () => {
    // Controle das abas principais
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const validTabs = new Set(Array.from(tabContents).map(el => el.id));

    function activateTab(tabId, options = { pushState: true }) {
        if (!validTabs.has(tabId)) return;
        // Remove active de todos os botões e conteúdos
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        // Ativa conteúdo
        const targetContent = document.getElementById(tabId);
        if (targetContent) targetContent.classList.add('active');
        // Ativa botão correspondente
        const btn = Array.from(tabButtons).find(b => b.getAttribute('data-tab') === tabId);
        if (btn) btn.classList.add('active');
        // Atualiza hash da URL
        if (options.pushState) {
            if (location.hash !== `#${tabId}`) {
                history.pushState(null, '', `#${tabId}`);
            }
        }
        // Foco no título da seção para melhor UX
        const h2 = targetContent ? targetContent.querySelector('h2') : null;
        if (h2) h2.focus?.();
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            activateTab(targetTab, { pushState: true });
        });
    });

    // deep-link: ativa aba pelo hash na URL ao carregar
    const hash = (location.hash || '').replace(/^#/, '');
    if (validTabs.has(hash)) {
        activateTab(hash, { pushState: false });
    } else {
        // Garante que a aba padrão esteja ativa
        const defaultTab = document.querySelector('.tab-content.active')?.id || 'intro';
        activateTab(defaultTab, { pushState: false });
    }

    // Responde a navegação de histórico (voltar/avançar)
    window.addEventListener('hashchange', () => {
        const current = (location.hash || '').replace(/^#/, '');
        if (validTabs.has(current)) {
            activateTab(current, { pushState: false });
        }
    });

    // Converte cliques em links internos #tab para ativar a aba
    document.body.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const target = anchor.getAttribute('href').replace(/^#/, '');
        if (validTabs.has(target)) {
            e.preventDefault();
            activateTab(target, { pushState: true });
        }
    });

    // Controle das abas de código
    const codeTabButtons = document.querySelectorAll('.code-tab-btn');
    const codeTabPanels = document.querySelectorAll('.code-tab-panel');

    function activateCodeTab(codeId) {
        codeTabButtons.forEach(btn => btn.classList.remove('active'));
        codeTabPanels.forEach(panel => panel.classList.remove('active'));
        const btn = Array.from(codeTabButtons).find(b => b.getAttribute('data-code') === codeId);
        const panel = document.getElementById(`code-${codeId}`);
        if (btn) btn.classList.add('active');
        if (panel) panel.classList.add('active');
    }

    codeTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetCode = button.getAttribute('data-code');
            activateCodeTab(targetCode);
        });
    });

    // Suporte opcional a deep-link de código: #codigos?tab=rfid
    const params = new URLSearchParams(location.hash.includes('?') ? location.hash.split('?')[1] : '');
    const codeParam = params.get('tab');
    if (codeParam) {
        activateTab('codigos', { pushState: false });
        activateCodeTab(codeParam);
    }

    // Botão Voltar ao Topo
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        const toggleBackToTop = () => {
            if (window.scrollY > 300) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        };
        toggleBackToTop();
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Animações de entrada para cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar cards para animação
    document.querySelectorAll('.sensor-card, .intro-card, .timeline-item, .protocol-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
