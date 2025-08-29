// Rolagem suave e destaque do item ativo no menu
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    // Rolagem suave para cliques no menu
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const el = document.querySelector(targetId);
                if (el) {
                    window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
                }
            }
        });
    });

    // Observer para ativar link conforme seção visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const idx = sections.indexOf(entry.target);
            if (idx >= 0) {
                const link = navLinks[idx];
                if (entry.isIntersecting) {
                    navLinks.forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }, { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0.1 });

    sections.forEach(sec => observer.observe(sec));

    // TOC dinâmico por seção (lista de h3)
    sections.forEach(section => {
        const headings = Array.from(section.querySelectorAll('h3'));
        if (headings.length === 0) return;

        // Garante ids únicos para subtítulos
        headings.forEach(h => {
            if (!h.id) {
                const base = (h.textContent || '')
                    .toLowerCase()
                    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                let candidate = base || 'topico';
                let i = 2;
                while (document.getElementById(candidate)) {
                    candidate = `${base}-${i++}`;
                }
                h.id = candidate;
            }
        });

        const toc = document.createElement('div');
        toc.className = 'toc';
        const label = document.createElement('strong');
        label.textContent = 'Nesta seção:';
        toc.appendChild(label);

        headings.forEach((h, idx) => {
            const a = document.createElement('a');
            a.href = `#${h.id}`;
            a.textContent = (h.textContent || '').replace(/^\d+\.\d+\s+/, '') || `Tópico ${idx + 1}`;
            toc.appendChild(a);
        });

        const container = section.querySelector('.container');
        if (container) {
            container.insertBefore(toc, container.children[1] || null);
        }
    });
});