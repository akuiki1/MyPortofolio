import { Head } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import '../../css/portfolio.css';

const navLinks = [
    { label: 'About', href: '#about', num: '01' },
    { label: 'Work', href: '#work', num: '02' },
    { label: 'Skills', href: '#skills', num: '03' },
    { label: 'Services', href: '#services', num: '04' },
    { label: 'Contact', href: '#contact', num: '05' },
];

const ticker = [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Tailwind CSS',
    'Laravel',
    'PostgreSQL',
    'GraphQL',
    'Docker',
    'Vue',
    'Express',
    'Figma',
];
const tickerLoop = ticker.concat(ticker);

const stats = [
    { value: 5, suffix: '+', label: 'Years building' },
    { value: 40, suffix: '+', label: 'Projects shipped' },
    { value: 32, suffix: '+', label: 'Happy clients' },
    { value: 99, suffix: '%', label: 'On-time delivery' },
];

const facts = [
    { k: 'Location', v: 'Indonesia · Remote' },
    { k: 'Experience', v: '5+ years' },
    { k: 'Focus', v: 'Web apps & sites' },
    { k: 'Status', v: 'Available' },
];

const skillGroups = [
    {
        title: 'Frontend',
        items: [
            'HTML5',
            'CSS3',
            'JavaScript',
            'TypeScript',
            'React',
            'Next.js',
            'Vue',
            'Tailwind CSS',
        ],
    },
    {
        title: 'Backend',
        items: ['Node.js', 'Express', 'PHP', 'Laravel', 'REST APIs', 'GraphQL'],
    },
    {
        title: 'Database & Tools',
        items: [
            'PostgreSQL',
            'MySQL',
            'MongoDB',
            'Git',
            'Docker',
            'Figma',
            'Vercel',
        ],
    },
];

const projects = [
    {
        name: 'Nexus Commerce',
        category: 'E-Commerce',
        year: '2025',
        desc: 'Headless storefront with sub-second loads and a custom checkout flow.',
        tags: ['Next.js', 'Stripe', 'PostgreSQL'],
        placeholder: 'Drop Nexus screenshot',
    },
    {
        name: 'Lumina Analytics',
        category: 'SaaS Dashboard',
        year: '2025',
        desc: 'Real-time analytics dashboard handling millions of events a day.',
        tags: ['React', 'Node.js', 'WebSocket'],
        placeholder: 'Drop Lumina screenshot',
    },
    {
        name: 'Wander',
        category: 'Travel Booking',
        year: '2024',
        desc: 'End-to-end booking experience with live maps and availability.',
        tags: ['Vue', 'Laravel', 'MySQL'],
        placeholder: 'Drop Wander screenshot',
    },
    {
        name: 'Pulse Fitness',
        category: 'Health & Fitness',
        year: '2024',
        desc: 'Mobile-first PWA with offline workouts and progress tracking.',
        tags: ['React', 'PWA', 'IndexedDB'],
        placeholder: 'Drop Pulse screenshot',
    },
    {
        name: 'Verde Finance',
        category: 'Fintech',
        year: '2023',
        desc: 'Personal finance app with secure bank integrations and budgets.',
        tags: ['Next.js', 'Plaid', 'Prisma'],
        placeholder: 'Drop Verde screenshot',
    },
    {
        name: 'Orbit Studio',
        category: 'Agency Site',
        year: '2023',
        desc: 'Award-style marketing site with rich, performant motion design.',
        tags: ['Astro', 'GSAP', 'WebGL'],
        placeholder: 'Drop Orbit screenshot',
    },
];

const services = [
    {
        num: '01',
        title: 'Web Development',
        desc: 'Complete websites and web apps built from scratch — responsive, fast, and ready to scale.',
        points: [
            'Landing & marketing sites',
            'Web applications',
            'CMS integration',
        ],
    },
    {
        num: '02',
        title: 'Frontend Engineering',
        desc: 'Pixel-perfect interfaces with smooth interactions and rock-solid accessibility.',
        points: ['Design-to-code', 'Component systems', 'Micro-interactions'],
    },
    {
        num: '03',
        title: 'Backend & APIs',
        desc: 'Reliable server-side logic, databases, and APIs that quietly power your product.',
        points: [
            'REST & GraphQL APIs',
            'Database design',
            'Auth & integrations',
        ],
    },
    {
        num: '04',
        title: 'Performance & SEO',
        desc: 'Audits and optimization to make your site lightning fast and easy to find.',
        points: ['Core Web Vitals', 'SEO foundations', 'Speed tuning'],
    },
];

const testimonials = [
    {
        quote: 'Rizki turned our outdated site into a fast, modern platform. Conversions jumped 40% within two months.',
        name: 'Sarah Lin',
        role: 'Founder, Brightwave',
        initials: 'SL',
    },
    {
        quote: 'Clean code, clear communication, and delivered ahead of schedule. Exactly the developer you hope to find.',
        name: 'Andre Pratama',
        role: 'CTO, Lumina',
        initials: 'AP',
    },
    {
        quote: 'He understood our product better than we did. The new dashboard is genuinely a joy to use.',
        name: 'Maria Gomez',
        role: 'PM, Verde Finance',
        initials: 'MG',
    },
];

const socials = [
    { label: 'GitHub', handle: 'github.com/rizkisyandana', href: '#' },
    { label: 'LinkedIn', handle: 'in/rizkisyandana', href: '#' },
    { label: 'Instagram', handle: '@rizki.dev', href: '#' },
    {
        label: 'Email',
        handle: 'hello@rizki.dev',
        href: 'mailto:hello@rizki.dev',
    },
];

const year = 2026;

export default function Welcome() {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;

        if (!root) {
            return;
        }

        document.documentElement.classList.add('pf-active');
        const cleanups: Array<() => void> = [];

        // Reveal on scroll
        {
            const els = Array.from(
                root.querySelectorAll<HTMLElement>('[data-reveal]'),
            );
            const reveal = (el: HTMLElement) => {
                const d = parseInt(el.getAttribute('data-delay') || '0', 10);
                el.style.transitionDelay = `${d}ms`;
                el.style.opacity = '1';
                el.style.transform = 'none';
            };

            if (!('IntersectionObserver' in window)) {
                els.forEach(reveal);
            } else {
                els.forEach((el) => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(28px)';
                    el.style.transition =
                        'opacity .75s cubic-bezier(.2,.7,.2,1), transform .75s cubic-bezier(.2,.7,.2,1)';
                });
                const io = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((e) => {
                            if (e.isIntersecting) {
                                reveal(e.target as HTMLElement);
                                io.unobserve(e.target);
                            }
                        });
                    },
                    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
                );
                els.forEach((el) => io.observe(el));
                cleanups.push(() => io.disconnect());
            }
        }

        // Animated counters
        {
            const els = Array.from(
                root.querySelectorAll<HTMLElement>('[data-count]'),
            );

            if (!('IntersectionObserver' in window)) {
                els.forEach((el) => {
                    el.textContent = el.getAttribute('data-count');
                });
            } else {
                const io = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((e) => {
                            if (!e.isIntersecting) {
                                return;
                            }

                            const el = e.target as HTMLElement;
                            const target = parseFloat(
                                el.getAttribute('data-count') || '0',
                            );
                            const dur = 1500;
                            const t0 = performance.now();
                            const step = (t: number) => {
                                const p = Math.min((t - t0) / dur, 1);
                                const ease = 1 - Math.pow(1 - p, 3);
                                el.textContent = Math.round(
                                    target * ease,
                                ).toString();

                                if (p < 1) {
                                    requestAnimationFrame(step);
                                } else {
                                    el.textContent = target.toString();
                                }
                            };
                            requestAnimationFrame(step);
                            io.unobserve(el);
                        });
                    },
                    { threshold: 0.6 },
                );
                els.forEach((el) => io.observe(el));
                cleanups.push(() => io.disconnect());
            }
        }

        const hero = root.querySelector<HTMLElement>('[data-hero]');

        // Parallax
        if (hero) {
            const layers = Array.from(
                root.querySelectorAll<HTMLElement>('[data-parallax]'),
            );
            const onMove = (e: MouseEvent) => {
                const r = hero.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                layers.forEach((l) => {
                    const f = parseFloat(
                        l.getAttribute('data-parallax') || '0',
                    );
                    l.style.transform = `translate(${(x * f * 130).toFixed(1)}px,${(y * f * 90).toFixed(1)}px)`;
                });
            };
            const onLeave = () => {
                layers.forEach((l) => {
                    l.style.transform = 'translate(0,0)';
                });
            };
            hero.addEventListener('mousemove', onMove);
            hero.addEventListener('mouseleave', onLeave);
            cleanups.push(() => {
                hero.removeEventListener('mousemove', onMove);
                hero.removeEventListener('mouseleave', onLeave);
            });
        }

        // Cursor glow
        {
            const glow = root.querySelector<HTMLElement>('[data-cursorglow]');

            if (hero && glow) {
                const onMove = (e: MouseEvent) => {
                    const r = hero.getBoundingClientRect();
                    glow.style.left = `${e.clientX - r.left}px`;
                    glow.style.top = `${e.clientY - r.top}px`;
                    glow.style.transform = 'translate(-50%,-50%)';
                    glow.style.opacity = '1';
                };
                const onLeave = () => {
                    glow.style.opacity = '0';
                };
                hero.addEventListener('mousemove', onMove);
                hero.addEventListener('mouseleave', onLeave);
                cleanups.push(() => {
                    hero.removeEventListener('mousemove', onMove);
                    hero.removeEventListener('mouseleave', onLeave);
                });
            }
        }

        // Sticky nav background
        {
            const nav = root.querySelector<HTMLElement>('[data-nav]');
            const onScroll = () => {
                if (!nav) {
                    return;
                }

                nav.classList.toggle('is-scrolled', window.scrollY > 24);
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
            cleanups.push(() => window.removeEventListener('scroll', onScroll));

            // Mobile menu
            const burger = root.querySelector<HTMLElement>('[data-burger]');
            const menu = root.querySelector<HTMLElement>('[data-mobile-menu]');

            if (burger && menu) {
                const close = () => {
                    menu.classList.remove('is-open');
                    document.body.style.overflow = '';
                };
                const toggle = () => {
                    const open = menu.classList.toggle('is-open');
                    document.body.style.overflow = open ? 'hidden' : '';
                };
                burger.addEventListener('click', toggle);
                const links = Array.from(menu.querySelectorAll('a'));
                links.forEach((a) => a.addEventListener('click', close));
                cleanups.push(() => {
                    burger.removeEventListener('click', toggle);
                    links.forEach((a) => a.removeEventListener('click', close));
                    document.body.style.overflow = '';
                });
            }
        }

        // Terminal typing
        {
            const term = root.querySelector<HTMLElement>('[data-terminal]');

            if (term) {
                const types = Array.from(
                    term.querySelectorAll<HTMLElement>('[data-type]'),
                );
                types.forEach((t) => {
                    t.dataset.full = t.textContent || '';
                    t.textContent = '';
                });
                let started = false;
                const run = () => {
                    if (started) {
                        return;
                    }

                    started = true;
                    let i = 0;
                    const typeNext = () => {
                        if (i >= types.length) {
                            return;
                        }

                        const el = types[i];
                        const full = el.dataset.full || '';
                        let c = 0;
                        const tick = () => {
                            el.textContent = full.slice(0, c);
                            c++;

                            if (c <= full.length) {
                                setTimeout(tick, 16 + Math.random() * 30);
                            } else {
                                i++;
                                setTimeout(typeNext, 240);
                            }
                        };
                        tick();
                    };
                    typeNext();
                };

                if (!('IntersectionObserver' in window)) {
                    run();
                } else {
                    const io = new IntersectionObserver(
                        (es) => {
                            es.forEach((e) => {
                                if (e.isIntersecting) {
                                    run();
                                    io.disconnect();
                                }
                            });
                        },
                        { threshold: 0.4 },
                    );
                    io.observe(term);
                    cleanups.push(() => io.disconnect());
                }
            }
        }

        // Contact form
        {
            const form = root.querySelector<HTMLFormElement>('[data-form]');

            if (form) {
                const onSubmit = (e: Event) => {
                    e.preventDefault();
                    const btn =
                        form.querySelector<HTMLElement>('[data-submit]');
                    const ok = form.querySelector<HTMLElement>(
                        '[data-form-success]',
                    );

                    if (btn) {
                        btn.textContent = 'Message sent ✓';
                    }

                    if (ok) {
                        ok.classList.add('is-visible');
                    }
                };
                form.addEventListener('submit', onSubmit);
                cleanups.push(() =>
                    form.removeEventListener('submit', onSubmit),
                );
            }
        }

        // Active nav link
        {
            const links = Array.from(
                root.querySelectorAll<HTMLElement>('[data-navlink]'),
            );

            if (links.length && 'IntersectionObserver' in window) {
                const io = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((e) => {
                            if (!e.isIntersecting) {
                                return;
                            }

                            const id = `#${e.target.id}`;
                            links.forEach((l) => {
                                l.classList.toggle(
                                    'is-active',
                                    l.getAttribute('href') === id,
                                );
                            });
                        });
                    },
                    { rootMargin: '-45% 0px -50% 0px' },
                );
                root.querySelectorAll<HTMLElement>('section[id]').forEach((s) =>
                    io.observe(s),
                );
                cleanups.push(() => io.disconnect());
            }
        }

        return () => {
            document.documentElement.classList.remove('pf-active');
            cleanups.forEach((fn) => fn());
        };
    }, []);

    return (
        <>
            <Head title="Rizki Syandana — Web Developer Specialist">
                <meta
                    name="description"
                    content="Rizki Syandana — Web Developer Specialist crafting fast, accessible, delightful websites."
                    head-key="description"
                />
                <link
                    rel="preload"
                    as="image"
                    href="/portfolio/rizki.webp"
                    type="image/webp"
                    fetchPriority="high"
                    head-key="hero-photo"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div ref={rootRef} className="pf">
                {/* NAV */}
                <nav data-nav className="pf-nav">
                    <a href="#top" className="pf-logo">
                        <span className="pf-logo-badge">RS</span>
                        <span className="pf-logo-text">
                            rizki<span className="pf-accent">.dev</span>
                        </span>
                    </a>
                    <div className="pf-navlinks">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                data-navlink
                                href={link.href}
                                className="pf-navlink"
                            >
                                <span className="pf-navlink-num">
                                    {link.num}
                                </span>
                                {link.label}
                            </a>
                        ))}
                        <a href="#contact" className="pf-cta">
                            Let's talk
                        </a>
                    </div>
                    <button data-burger aria-label="Menu" className="pf-burger">
                        <span />
                        <span />
                    </button>
                </nav>

                {/* MOBILE MENU */}
                <div data-mobile-menu className="pf-mobile-menu">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="pf-mobile-link"
                        >
                            <span>{link.num}</span>
                            {link.label}
                        </a>
                    ))}
                    <a href="#contact" className="pf-mobile-cta">
                        Let's talk
                    </a>
                </div>

                {/* HERO */}
                <header id="top" data-hero className="pf-hero">
                    <div data-grid className="pf-grid" />
                    <div className="pf-hero-glow" />
                    <div className="pf-scan-wrap">
                        <div className="pf-scan" />
                    </div>
                    <div className="pf-vignette" />
                    <div data-cursorglow className="pf-cursorglow" />

                    <div className="pf-bgword-wrap">
                        <div
                            data-bgword
                            data-parallax="0.022"
                            className="pf-bgword"
                        >
                            DEVELOPER
                        </div>
                    </div>

                    <div className="pf-vtext pf-vtext-left">
                        FULL-STACK · WEB ENGINEER
                    </div>
                    <div className="pf-vtext pf-vtext-right">
                        PORTFOLIO — 2026
                    </div>

                    <div className="pf-names-grid">
                        <div className="pf-name-right">
                            <div className="pf-eyebrow-neon">WEB DEVELOPER</div>
                            <div className="pf-name-big">RIZKI</div>
                        </div>
                        <div />
                        <div className="pf-name-left">
                            <div className="pf-name-big">
                                SYANDANA<span className="pf-accent">.</span>
                            </div>
                            <div className="pf-eyebrow-muted">
                                // SPECIALIST
                            </div>
                        </div>
                    </div>

                    <div className="pf-photo-layer">
                        <div className="pf-photo-anim">
                            <div className="pf-photo-glow1" />
                            <div className="pf-photo-glow2" />
                            <div data-parallax="-0.018">
                                <picture>
                                    <source srcSet="/portfolio/rizki.webp" type="image/webp" />
                                    <img
                                        data-photo
                                        src="/portfolio/rizki.png"
                                        alt="Rizki Syandana, Web Developer Specialist"
                                        className="pf-photo"
                                        width={1024}
                                        height={1536}
                                        fetchPriority="high"
                                        decoding="async"
                                    />
                                </picture>
                            </div>
                        </div>
                    </div>

                    <div className="pf-availbadge-wrap">
                        <div className="pf-badge">
                            <span className="pf-badge-dot" />
                            AVAILABLE FOR NEW PROJECTS
                        </div>
                    </div>

                    <div className="pf-hero-bottom">
                        <div data-name-stack className="pf-name-stack">
                            <div className="pf-name-stack-text">
                                RIZKI SYANDANA
                                <span className="pf-accent">.</span>
                            </div>
                        </div>
                        <p className="pf-hero-sub">
                            I craft fast, accessible, and genuinely delightful
                            websites — from pixel-perfect front-ends to
                            dependable back-ends.
                        </p>
                        <div className="pf-hero-actions">
                            <a href="#work" className="pf-btn-primary">
                                View my work <span>→</span>
                            </a>
                            <a href="#contact" className="pf-btn-ghost">
                                Get in touch
                            </a>
                        </div>
                        <div className="pf-scroll">
                            SCROLL
                            <span className="pf-scroll-arrow">↓</span>
                        </div>
                    </div>
                </header>

                {/* TICKER */}
                <div className="pf-ticker">
                    <div className="pf-ticker-track">
                        {tickerLoop.map((t, i) => (
                            <span key={`${t}-${i}`} className="pf-ticker-item">
                                {t}
                                <span className="pf-accent">/</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* ABOUT */}
                <section id="about" className="pf-section">
                    <div
                        data-reveal
                        className="pf-eyebrow-row"
                        style={{ marginBottom: 'clamp(36px,5vh,56px)' }}
                    >
                        <span className="pf-eyebrow">01 / ABOUT</span>
                        <span className="pf-rule" />
                    </div>
                    <div className="pf-about-grid">
                        <div data-reveal>
                            <h2 className="pf-about-title">
                                I build websites that feel as good as they look.
                            </h2>
                            <p className="pf-lead">
                                I'm Rizki Syandana, a web developer specialist
                                based in Indonesia. Over the last five years
                                I've partnered with startups, agencies, and
                                founders to turn rough ideas into polished,
                                high-performance products.
                            </p>
                            <p className="pf-lead pf-lead-last">
                                My focus is simple: clean code, thoughtful
                                interfaces, and shipping work that actually
                                moves the needle — on time, every time.
                            </p>
                            <div className="pf-facts">
                                {facts.map((fact) => (
                                    <div key={fact.k} className="pf-fact">
                                        <div className="pf-fact-k">
                                            {fact.k}
                                        </div>
                                        <div className="pf-fact-v">
                                            {fact.v}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <a href="#contact" className="pf-btn-ghost">
                                Start a project <span>→</span>
                            </a>
                        </div>
                        <div data-reveal data-terminal className="pf-terminal">
                            <div className="pf-term-bar">
                                <span
                                    className="pf-term-dot"
                                    style={{ background: '#ff5f56' }}
                                />
                                <span
                                    className="pf-term-dot"
                                    style={{ background: '#ffbd2e' }}
                                />
                                <span
                                    className="pf-term-dot"
                                    style={{ background: '#27c93f' }}
                                />
                                <span className="pf-term-title">
                                    rizki@portfolio: ~
                                </span>
                            </div>
                            <div className="pf-term-body">
                                <div>
                                    <span className="pf-term-prompt">$</span>{' '}
                                    <span data-type>whoami</span>
                                </div>
                                <div className="pf-term-out">
                                    <span className="pf-term-arrow">↳</span>{' '}
                                    <span data-type>
                                        Rizki Syandana — Web Developer
                                        Specialist
                                    </span>
                                </div>
                                <div className="pf-term-line-gap">
                                    <span className="pf-term-prompt">$</span>{' '}
                                    <span data-type>cat stack.txt</span>
                                </div>
                                <div className="pf-term-out">
                                    <span className="pf-term-arrow">↳</span>{' '}
                                    <span data-type>
                                        React · Next.js · Node.js · Laravel
                                    </span>
                                </div>
                                <div className="pf-term-line-gap">
                                    <span className="pf-term-prompt">$</span>{' '}
                                    <span data-type>cat location.txt</span>
                                </div>
                                <div className="pf-term-out">
                                    <span className="pf-term-arrow">↳</span>{' '}
                                    <span data-type>
                                        Indonesia · working with clients
                                        worldwide
                                    </span>
                                </div>
                                <div className="pf-term-line-gap">
                                    <span className="pf-term-prompt">$</span>{' '}
                                    <span data-type>status --now</span>
                                </div>
                                <div className="pf-term-out">
                                    <span className="pf-term-arrow">↳</span>{' '}
                                    <span data-type>
                                        Available for freelance &amp; full-time
                                    </span>
                                    <span className="pf-term-cursor" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div data-reveal className="pf-stats">
                        {stats.map((stat) => (
                            <div key={stat.label} className="pf-stat">
                                <div className="pf-stat-num">
                                    <span data-count={stat.value}>0</span>
                                    <span className="pf-accent">
                                        {stat.suffix}
                                    </span>
                                </div>
                                <div className="pf-stat-label">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* WORK */}
                <section id="work" className="pf-section">
                    <div
                        data-reveal
                        className="pf-eyebrow-row"
                        style={{ marginBottom: '18px' }}
                    >
                        <span className="pf-eyebrow">02 / SELECTED WORK</span>
                        <span className="pf-rule" />
                        <span className="pf-count-label">(06)</span>
                    </div>
                    <div data-reveal className="pf-section-head pf-work-head">
                        <h2 className="pf-h2">Selected projects.</h2>
                        <p>
                            A few recent builds. Drop your own screenshots
                            straight onto each card to make it yours.
                        </p>
                    </div>
                    <div className="pf-cards">
                        {projects.map((project) => (
                            <article
                                key={project.name}
                                data-reveal
                                className="pf-card"
                            >
                                <div className="pf-card-media">
                                    <div className="pf-card-slot">
                                        <span className="pf-card-slot-text">
                                            <span>+</span>
                                            {project.placeholder}
                                        </span>
                                    </div>
                                    <div className="pf-card-badge pf-card-badge-cat">
                                        {project.category}
                                    </div>
                                    <div className="pf-card-badge pf-card-badge-year">
                                        {project.year}
                                    </div>
                                </div>
                                <div className="pf-card-body">
                                    <div className="pf-card-title-row">
                                        <h3 className="pf-card-title">
                                            {project.name}
                                        </h3>
                                        <span className="pf-card-arrow">↗</span>
                                    </div>
                                    <p className="pf-card-desc">
                                        {project.desc}
                                    </p>
                                    <div className="pf-tags">
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="pf-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* SKILLS */}
                <div className="pf-band">
                    <section id="skills" className="pf-section">
                        <div
                            data-reveal
                            className="pf-eyebrow-row"
                            style={{ marginBottom: '18px' }}
                        >
                            <span className="pf-eyebrow">03 / TECH STACK</span>
                            <span className="pf-rule" />
                        </div>
                        <div data-reveal className="pf-section-head">
                            <h2 className="pf-h2">Tools I reach for.</h2>
                            <p style={{ maxWidth: '40ch' }}>
                                A pragmatic, modern stack — picked to ship
                                reliable products fast, not to chase hype.
                            </p>
                        </div>
                        <div className="pf-skill-grid">
                            {skillGroups.map((group) => (
                                <div
                                    key={group.title}
                                    data-reveal
                                    className="pf-skill-card"
                                >
                                    <h3 className="pf-skill-title">
                                        <span className="pf-skill-dot" />
                                        {group.title}
                                    </h3>
                                    <div className="pf-chips">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="pf-chip"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p data-reveal className="pf-learn">
                            // Always learning — currently exploring{' '}
                            <span className="pf-accent">Rust</span> &amp;{' '}
                            <span className="pf-accent">WebGPU</span>
                        </p>
                    </section>
                </div>

                {/* SERVICES */}
                <section id="services" className="pf-section">
                    <div
                        data-reveal
                        className="pf-eyebrow-row"
                        style={{ marginBottom: '18px' }}
                    >
                        <span className="pf-eyebrow">04 / SERVICES</span>
                        <span className="pf-rule" />
                    </div>
                    <div data-reveal className="pf-section-head">
                        <h2 className="pf-h2">How I can help.</h2>
                        <p style={{ maxWidth: '40ch' }}>
                            From a single landing page to a full product —
                            here's where I can jump in.
                        </p>
                    </div>
                    <div className="pf-service-grid">
                        {services.map((service) => (
                            <div
                                key={service.num}
                                data-reveal
                                className="pf-service"
                            >
                                <div className="pf-service-num">
                                    {service.num}
                                </div>
                                <h3 className="pf-service-title">
                                    {service.title}
                                </h3>
                                <p className="pf-service-desc">
                                    {service.desc}
                                </p>
                                <div className="pf-points">
                                    {service.points.map((point) => (
                                        <div key={point} className="pf-point">
                                            <span>▸</span>
                                            {point}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <div className="pf-band">
                    <section id="testimonials" className="pf-section">
                        <div
                            data-reveal
                            className="pf-eyebrow-row"
                            style={{ marginBottom: 'clamp(36px,5vh,52px)' }}
                        >
                            <span className="pf-eyebrow">
                                05 / TESTIMONIALS
                            </span>
                            <span className="pf-rule" />
                        </div>
                        <div
                            data-reveal
                            style={{ marginBottom: 'clamp(36px,5vh,52px)' }}
                        >
                            <h2 className="pf-h2">Kind words from clients.</h2>
                        </div>
                        <div className="pf-testi-grid">
                            {testimonials.map((t) => (
                                <figure
                                    key={t.name}
                                    data-reveal
                                    className="pf-testi"
                                >
                                    <div className="pf-testi-mark">&ldquo;</div>
                                    <blockquote className="pf-testi-quote">
                                        {t.quote}
                                    </blockquote>
                                    <figcaption className="pf-testi-foot">
                                        <span className="pf-testi-avatar">
                                            {t.initials}
                                        </span>
                                        <span>
                                            <div className="pf-testi-name">
                                                {t.name}
                                            </div>
                                            <div className="pf-testi-role">
                                                {t.role}
                                            </div>
                                        </span>
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </section>
                </div>

                {/* CONTACT */}
                <section id="contact" className="pf-section">
                    <div
                        data-reveal
                        className="pf-eyebrow-row"
                        style={{ marginBottom: 'clamp(40px,6vh,64px)' }}
                    >
                        <span className="pf-eyebrow">06 / GET IN TOUCH</span>
                        <span className="pf-rule" />
                    </div>
                    <div className="pf-contact-grid">
                        <div data-reveal>
                            <h2 className="pf-contact-h2">
                                Let's build something great.
                            </h2>
                            <p className="pf-contact-lead">
                                Have a project in mind, or just want to say hi?
                                My inbox is always open — I usually reply within
                                a day.
                            </p>
                            <a
                                href="mailto:hello@rizki.dev"
                                className="pf-email-link"
                            >
                                hello@rizki.dev
                            </a>
                            <div className="pf-contact-badge">
                                <span className="pf-badge-dot" />
                                AVAILABLE FOR NEW PROJECTS
                            </div>
                            <div className="pf-socials">
                                {socials.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        className="pf-social"
                                    >
                                        <span className="pf-social-label">
                                            {s.label}
                                        </span>
                                        <span className="pf-social-handle">
                                            {s.handle}
                                        </span>
                                        <span className="pf-accent">↗</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <form data-form data-reveal className="pf-form">
                            <div className="pf-field">
                                <label className="pf-label">Your name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Jane Doe"
                                    className="pf-input"
                                />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="jane@company.com"
                                    className="pf-input"
                                />
                            </div>
                            <div className="pf-field">
                                <label className="pf-label">
                                    Project details
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="Tell me a little about what you're building..."
                                    className="pf-textarea"
                                />
                            </div>
                            <button
                                data-submit
                                type="submit"
                                className="pf-submit"
                            >
                                Send message →
                            </button>
                            <div data-form-success className="pf-form-success">
                                <span>✓</span> Thanks! I'll get back to you
                                within 24 hours.
                            </div>
                        </form>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="pf-footer">
                    <div className="pf-footer-inner">
                        <div className="pf-footer-brand">
                            <a href="#top" className="pf-footer-logo">
                                <span className="pf-logo-badge">RS</span>
                                <span className="pf-logo-text">
                                    rizki<span className="pf-accent">.dev</span>
                                </span>
                            </a>
                            <p className="pf-footer-tagline">
                                Web Developer Specialist building fast,
                                thoughtful products for the web. Available
                                worldwide, remote.
                            </p>
                        </div>
                        <div className="pf-footer-cols">
                            <div>
                                <div className="pf-footer-col-title">
                                    SITEMAP
                                </div>
                                <div className="pf-footer-links">
                                    {navLinks.map((link) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className="pf-footer-link"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="pf-footer-col-title">
                                    ELSEWHERE
                                </div>
                                <div className="pf-footer-links">
                                    {socials.map((s) => (
                                        <a
                                            key={s.label}
                                            href={s.href}
                                            className="pf-footer-link"
                                        >
                                            {s.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pf-footer-bottom">
                        <span>
                            © {year} Rizki Syandana — All rights reserved
                        </span>
                        <span>Designed &amp; built with care</span>
                        <a href="#top" className="pf-backtotop">
                            BACK TO TOP ↑
                        </a>
                    </div>
                    <div aria-hidden="true" className="pf-footer-bigword">
                        SYANDANA
                    </div>
                </footer>
            </div>
        </>
    );
}
