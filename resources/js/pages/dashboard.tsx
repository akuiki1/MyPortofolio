import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import {
    destroy as destroyProject,
    store as storeProject,
    update as updateProject,
} from '@/actions/App/Http/Controllers/Admin/ProjectController';
import {
    destroy as destroyTestimonial,
    update as updateTestimonial,
} from '@/actions/App/Http/Controllers/Admin/TestimonialController';
import { logout } from '@/routes';
import '../../css/dashboard.css';

/* ------------------------------------------------------------------ data --- */

type ViewName =
    | 'overview'
    | 'messages'
    | 'projects'
    | 'testimonials'
    | 'analytics'
    | 'settings';

const C = {
    neon: '#00ff85',
    blue: '#6fb3ff',
    amber: '#ffbd2e',
    violet: '#c084fc',
    red: '#ff5f56',
};

/** Build a sparkline polyline `points` string from a small value array. */
function spark(arr: number[]): string {
    const w = 116;
    const h = 36;
    const p = 3;
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const rng = max - min || 1;

    return arr
        .map((v, i) => {
            const x = p + (i * (w - 2 * p)) / (arr.length - 1);
            const y = h - p - ((v - min) / rng) * (h - 2 * p);

            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ');
}

/** Smooth cubic-bezier visitor chart geometry (viewBox 0 0 760 260). */
const chart = (() => {
    const visitors = [
        300, 330, 310, 380, 360, 440, 410, 500, 470, 540, 600, 580, 650, 700,
        760, 720, 820, 880, 930, 1000, 1120,
    ];
    const W = 760;
    const H = 260;
    const padX = 12;
    const padTop = 14;
    const padBot = 30;
    const maxScale = 1200;
    const n = visitors.length;
    const px = (i: number) => padX + (i * (W - 2 * padX)) / (n - 1);
    const py = (v: number) =>
        H - padBot - (v / maxScale) * (H - padBot - padTop);
    const pts = visitors.map((v, i) => ({ x: px(i), y: py(v) }));
    let line = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;

    for (let i = 1; i < pts.length; i++) {
        const p0 = pts[i - 1];
        const p1 = pts[i];
        const cx = (p0.x + p1.x) / 2;

        line += ` C ${cx.toFixed(1)},${p0.y.toFixed(1)} ${cx.toFixed(1)},${p1.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
    }

    const last = pts[n - 1];
    const area = `${line} L ${last.x.toFixed(1)},${H - padBot} L ${pts[0].x.toFixed(1)},${H - padBot} Z`;

    return { line, area, lastX: last.x.toFixed(1), lastY: last.y.toFixed(1) };
})();

const overviewStats = [
    {
        label: 'Visitors',
        value: 12480,
        dec: false,
        suffix: '',
        delta: '18.2%',
        sub: 'vs last month',
        spark: spark([5, 7, 6, 8, 9, 8, 11, 13]),
    },
    {
        label: 'Messages',
        value: 38,
        dec: false,
        suffix: '',
        delta: '9.4%',
        sub: '3 new this week',
        spark: spark([2, 3, 2, 4, 3, 5, 4, 6]),
    },
    {
        label: 'Project views',
        value: 9310,
        dec: false,
        suffix: '',
        delta: '12.0%',
        sub: 'vs last month',
        spark: spark([6, 5, 7, 6, 8, 7, 9, 10]),
    },
    {
        label: 'Conversion',
        value: 4.6,
        dec: true,
        suffix: '%',
        delta: '0.8%',
        sub: 'visitor → contact',
        spark: spark([3, 4, 3, 5, 4, 4, 5, 6]),
    },
];

const sources = [
    { label: 'Direct', pct: 38, color: C.neon },
    { label: 'Organic search', pct: 31, color: C.blue },
    { label: 'Social', pct: 19, color: C.amber },
    { label: 'Referral', pct: 12, color: C.violet },
];

type Message = {
    id: string;
    name: string;
    email: string;
    initials: string;
    preview: string;
    time: string;
    starred: boolean;
    status: 'new' | 'replied' | 'open';
    project: string;
    budget: string;
    timeline: string;
    received: string;
    body: string;
    body2: string;
};

const badgeFor = (s: Message['status']) => {
    if (s === 'new') {
        return { label: 'New', color: C.neon, bg: 'rgba(0,255,133,.1)' };
    }

    if (s === 'replied') {
        return { label: 'Replied', color: C.blue, bg: 'rgba(111,179,255,.12)' };
    }

    return { label: 'Open', color: C.amber, bg: 'rgba(255,189,46,.12)' };
};

const activity = [
    {
        text: 'New message from Sarah Lin about a marketing redesign',
        time: '12 minutes ago',
        color: C.neon,
    },
    {
        text: 'Orbit Studio reached 1,500 total views',
        time: '2 hours ago',
        color: C.blue,
    },
    {
        text: 'You approved Maria Gomez’s testimonial',
        time: '5 hours ago',
        color: C.neon,
    },
    {
        text: 'Verde Finance was saved as a draft',
        time: 'Yesterday',
        color: C.amber,
    },
    {
        text: 'Deployment succeeded — rizki.dev is live',
        time: 'Yesterday',
        color: C.neon,
    },
];

const analyticsStats = [
    {
        label: 'Page views',
        value: 48210,
        dec: false,
        suffix: '',
        sub: 'Last 12 months',
    },
    {
        label: 'Avg. session',
        value: 2.4,
        dec: true,
        suffix: 'm',
        sub: 'Time on site',
    },
    {
        label: 'Pages / visit',
        value: 3.2,
        dec: true,
        suffix: '',
        sub: 'Engagement',
    },
    {
        label: 'New visitors',
        value: 67,
        dec: false,
        suffix: '%',
        sub: 'vs returning',
    },
];

const monthly = (() => {
    const vals = [
        620, 700, 680, 760, 820, 900, 880, 960, 1040, 1010, 1120, 1180,
    ];
    const names = [
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
    ];
    const max = 1240;

    return vals.map((v, i) => ({
        m: names[i],
        v: v.toLocaleString('en-US'),
        h: `${Math.round((v / max) * 100)}%`,
    }));
})();

const topPages = (() => {
    const max = 4210;

    return [
        { path: '/', v: 4210 },
        { path: '/work', v: 2980 },
        { path: '/work/nexus-commerce', v: 1840 },
        { path: '/about', v: 1320 },
        { path: '/contact', v: 960 },
    ].map((p) => ({
        path: p.path,
        views: p.v.toLocaleString('en-US'),
        w: `${Math.round((p.v / max) * 100)}%`,
    }));
})();

const devices = [
    { label: 'Desktop', pct: 58, color: 'var(--neon)' },
    { label: 'Mobile', pct: 36, color: C.blue },
    { label: 'Tablet', pct: 6, color: C.amber },
];

const initialPrefs = [
    {
        label: 'Email notifications',
        desc: 'Get notified when a new message arrives',
        on: true,
    },
    {
        label: 'Weekly summary',
        desc: 'A digest of traffic and messages every Monday',
        on: true,
    },
    {
        label: 'Show availability badge',
        desc: 'Display “available for work” on your site',
        on: true,
    },
    {
        label: 'Public analytics',
        desc: 'Let visitors see your project view counts',
        on: false,
    },
];

const accents = ['#00ff85', '#6fb3ff', '#ffbd2e', '#c084fc'];

const navOrder: ViewName[] = [
    'overview',
    'messages',
    'projects',
    'testimonials',
    'analytics',
    'settings',
];

const viewLabels: Record<ViewName, string> = {
    overview: 'Overview',
    messages: 'Messages',
    projects: 'Projects',
    testimonials: 'Testimonials',
    analytics: 'Analytics',
    settings: 'Settings',
};

const printSubs: Record<ViewName, string> = {
    overview: 'Key metrics, visitor trend, traffic sources & recent activity',
    messages: 'Contact-form inbox with reply, filters & read state',
    projects: 'Portfolio work — status, views & quick actions',
    testimonials: 'Client reviews with approval workflow',
    analytics: 'Traffic, top pages & device breakdown',
    settings: 'Profile, preferences & accent color',
};

function readableInk(hex: string): string {
    try {
        const c = hex.replace('#', '');
        const r = parseInt(c.slice(0, 2), 16);
        const g = parseInt(c.slice(2, 4), 16);
        const b = parseInt(c.slice(4, 6), 16);

        return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#06150d' : '#ffffff';
    } catch {
        return '#06150d';
    }
}

/* ----------------------------------------------------------- tiny helpers --- */

function Counter({ value, dec = false }: { value: number; dec?: boolean }) {
    const [text, setText] = useState(dec ? '0.0' : '0');

    useEffect(() => {
        let raf = 0;
        const dur = 1300;
        const t0 = performance.now();
        const fmt = (x: number) =>
            dec ? x.toFixed(1) : Math.round(x).toLocaleString('en-US');
        const step = (t: number) => {
            const p = Math.min((t - t0) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);

            setText(fmt(value * e));

            if (p < 1) {
                raf = requestAnimationFrame(step);
            } else {
                setText(fmt(value));
            }
        };

        raf = requestAnimationFrame(step);

        return () => cancelAnimationFrame(raf);
    }, [value, dec]);

    return <span>{text}</span>;
}

function GrowBar({
    target,
    axis = 'w',
    className,
    color,
}: {
    target: string;
    axis?: 'w' | 'h';
    className: string;
    color?: string;
}) {
    const [on, setOn] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setOn(true));

        return () => cancelAnimationFrame(id);
    }, []);

    const sizeStyle =
        axis === 'h'
            ? { height: on ? target : '0%' }
            : { width: on ? target : '0' };

    return (
        <span
            className={className}
            style={{ ...sizeStyle, ...(color ? { background: color } : {}) }}
        />
    );
}

/* ------------------------------------------------------------------- icons -- */

function svgProps(size: number, stroke = 1.7, color = 'currentColor') {
    return {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: color,
        strokeWidth: stroke,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };
}

const viewIcons: Record<ViewName, ReactNode> = {
    overview: (
        <svg {...svgProps(20)}>
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
    ),
    messages: (
        <svg {...svgProps(20)}>
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path d="M3.5 7l8.5 6 8.5-6" />
        </svg>
    ),
    projects: (
        <svg {...svgProps(20)}>
            <path d="M3 7.5a2 2 0 012-2h4l2 2.5h8a2 2 0 012 2V18a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
    ),
    testimonials: (
        <svg {...svgProps(20)}>
            <path d="M8 11a3 3 0 10-3-3v6a4 4 0 004 4M19 11a3 3 0 10-3-3v6a4 4 0 004 4" />
        </svg>
    ),
    analytics: (
        <svg {...svgProps(20)}>
            <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </svg>
    ),
    settings: (
        <svg {...svgProps(20)}>
            <circle cx="12" cy="12" r="3.2" />
            <path d="M19.4 13a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-2.9 1.2V20a2 2 0 11-4 0v-.2a1.7 1.7 0 00-2.9-1.1l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00-1.1-2.9H1a2 2 0 110-4h.2a1.7 1.7 0 001.1-2.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H11a1.7 1.7 0 001-1.6V1a2 2 0 114 0v.2a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V11a1.7 1.7 0 001.6 1H23a2 2 0 110 4h-.2a1.7 1.7 0 00-1.6 1z" />
        </svg>
    ),
};

/* ------------------------------------------------------------- component --- */

interface ProjectRow {
    id: number;
    name: string;
    mono: string;
    category: string;
    status: 'Published' | 'Draft';
    views: string;
    updated: string;
    title: string;
    year: string | null;
    description: string | null;
    tags: string[];
    statusValue: 'draft' | 'published';
    sortOrder: number;
    imageUrl: string | null;
}

interface TestimonialRow {
    id: number;
    name: string;
    role: string;
    initials: string;
    quote: string;
    pending: boolean;
}

interface DashboardProps {
    messages: Message[];
    projects: ProjectRow[];
    testimonials: TestimonialRow[];
    metrics: { messages: number; projectViews: number };
}

export default function Dashboard({
    messages,
    projects,
    testimonials,
    metrics,
}: DashboardProps) {
    const user = usePage().props.auth.user;
    const exportMode = Boolean(usePage().props.exportMode);
    const firstName = (user?.name || 'Rizki').split(' ')[0];

    const totalProjects = projects.length;
    const publishedProjects = projects.filter(
        (p) => p.status === 'Published',
    ).length;
    const draftProjects = totalProjects - publishedProjects;

    // Real KPI values where we have them; traffic metrics stay illustrative
    // until visit tracking lands.
    const overview = overviewStats.map((stat) =>
        stat.label === 'Messages'
            ? { ...stat, value: metrics.messages }
            : stat.label === 'Project views'
              ? { ...stat, value: metrics.projectViews }
              : stat,
    );

    const [view, setView] = useState<ViewName>('overview');
    const [collapsedPref, setCollapsedPref] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const [width, setWidth] = useState(1280);

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<
        'all' | 'unread' | 'starred' | 'replied'
    >('all');
    const [selectedId, setSelectedId] = useState(() => messages[0]?.id ?? '');
    const [unread, setUnread] = useState<Set<string>>(
        () =>
            new Set(
                messages.filter((m) => m.status === 'new').map((m) => m.id),
            ),
    );
    const [replySent, setReplySent] = useState(false);

    const [availability, setAvailability] = useState(true);
    const [accent, setAccent] = useState('#00ff85');
    const [prefs, setPrefs] = useState(() => initialPrefs.map((p) => p.on));
    const [projectModal, setProjectModal] = useState<{
        open: boolean;
        editing: ProjectRow | null;
    }>({ open: false, editing: null });
    const projectForm = useForm<{
        title: string;
        category: string;
        year: string;
        status: 'draft' | 'published';
        description: string;
        tags: string;
        image: File | null;
    }>({
        title: '',
        category: '',
        year: '',
        status: 'draft',
        description: '',
        tags: '',
        image: null,
    });
    const [trafficRange, setTrafficRange] = useState('21d');
    const [profileOpen, setProfileOpen] = useState(false);
    const [savedFlash, setSavedFlash] = useState(false);

    const searchRef = useRef<HTMLInputElement>(null);
    const replyRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        document.documentElement.classList.add('dash-active');
        const onResize = () => setWidth(window.innerWidth);

        onResize();
        window.addEventListener('resize', onResize);

        return () => {
            document.documentElement.classList.remove('dash-active');
            window.removeEventListener('resize', onResize);
        };
    }, []);

    useEffect(() => {
        if (exportMode) {
            return;
        }

        const onKey = (e: KeyboardEvent) => {
            const tag = (document.activeElement?.tagName || '').toLowerCase();

            if (e.key === '/' && tag !== 'input' && tag !== 'textarea') {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };

        document.addEventListener('keydown', onKey);

        return () => document.removeEventListener('keydown', onKey);
    }, [exportMode]);

    const isMobile = width < 860;
    const autoCollapse = width >= 860 && width < 1140;
    const collapsed = !isMobile && (collapsedPref || autoCollapse);
    const showLabels = !collapsed;
    const sidebarWidth = isMobile ? 250 : collapsed ? 76 : 250;
    const mainMargin = isMobile ? 0 : sidebarWidth;

    const unreadCount = unread.size;
    const pendingCount = testimonials.filter((t) => t.pending).length;

    const openCreateProject = () => {
        projectForm.clearErrors();
        projectForm.setData({
            title: '',
            category: '',
            year: '',
            status: 'draft',
            description: '',
            tags: '',
            image: null,
        });
        setProjectModal({ open: true, editing: null });
    };

    const openEditProject = (p: ProjectRow) => {
        projectForm.clearErrors();
        projectForm.setData({
            title: p.title,
            category: p.category,
            year: p.year ?? '',
            status: p.statusValue,
            description: p.description ?? '',
            tags: p.tags.join(', '),
            image: null,
        });
        setProjectModal({ open: true, editing: p });
    };

    const closeProjectModal = () => {
        setProjectModal({ open: false, editing: null });
        projectForm.reset();
        projectForm.clearErrors();
    };

    const submitProject = (e: FormEvent) => {
        e.preventDefault();

        projectForm.transform((data) => ({
            ...data,
            tags: data.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean),
        }));

        const options = {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => closeProjectModal(),
        };

        if (projectModal.editing) {
            projectForm.post(
                updateProject.url(projectModal.editing.id),
                options,
            );
        } else {
            projectForm.post(storeProject.url(), options);
        }
    };

    const deleteProject = (p: ProjectRow) => {
        if (!window.confirm(`Delete “${p.title}”? This cannot be undone.`)) {
            return;
        }

        router.delete(destroyProject.url(p.id), { preserveScroll: true });
    };

    const approveTestimonial = (t: TestimonialRow) => {
        router.patch(
            updateTestimonial.url(t.id),
            { status: 'approved' },
            { preserveScroll: true },
        );
    };

    const deleteTestimonial = (t: TestimonialRow) => {
        if (!window.confirm(`Delete the testimonial from ${t.name}?`)) {
            return;
        }

        router.delete(destroyTestimonial.url(t.id), { preserveScroll: true });
    };

    const goToView = (next: ViewName) => {
        setView(next);

        if (isMobile) {
            setNavOpen(false);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const subtitle: Record<ViewName, string> = {
        overview: `Welcome back, ${firstName}`,
        messages: `${unreadCount} unread · ${messages.length} total`,
        projects: 'Manage your portfolio work',
        testimonials: 'Approve client reviews',
        analytics: 'Traffic and engagement',
        settings: 'Account and preferences',
    };

    const visibleMessages = useMemo(() => {
        const q = search.trim().toLowerCase();

        return messages.filter((m) => {
            const okFilter =
                filter === 'all' ||
                (filter === 'unread' && unread.has(m.id)) ||
                (filter === 'starred' && m.starred) ||
                (filter === 'replied' && m.status === 'replied');
            const okQuery =
                !q || `${m.name} ${m.preview}`.toLowerCase().includes(q);

            return okFilter && okQuery;
        });
    }, [filter, messages, search, unread]);

    const selected =
        visibleMessages.find((m) => m.id === selectedId) ?? visibleMessages[0];

    const openMessage = (id: string) => {
        setSelectedId(id);
        setReplySent(false);

        if (unread.has(id)) {
            setUnread((prev) => {
                const next = new Set(prev);

                next.delete(id);

                return next;
            });
        }
    };

    const sendReply = () => {
        setReplySent(true);

        if (replyRef.current) {
            replyRef.current.value = '';
        }

        window.setTimeout(() => setReplySent(false), 2600);
    };

    const onGlobalSearch = (value: string) => {
        setSearch(value);

        if (value && view !== 'messages') {
            setView('messages');
        }
    };

    const rootStyle = {
        '--neon': accent,
        '--ink': readableInk(accent),
    } as CSSProperties;

    const fieldLabelStyle: CSSProperties = {
        display: 'block',
        fontSize: 12,
        fontWeight: 600,
        color: '#a7afa9',
        marginBottom: 6,
    };
    const fieldInputStyle: CSSProperties = {
        width: '100%',
        background: '#0c0e0d',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 9,
        color: '#ECEFEC',
        padding: '10px 12px',
        fontSize: 14,
        fontFamily: 'inherit',
    };
    const fieldErrorStyle: CSSProperties = {
        color: C.red,
        fontSize: 12,
        marginTop: 5,
    };

    /* --------------------------------------------------------------- views --- */

    const renderOverview = () => (
        <section key="overview" className="dash-panel">
            <div className="dash-stats">
                {overview.map((stat) => (
                    <div key={stat.label} className="dash-stat">
                        <div className="dash-stat-top">
                            <div>
                                <div className="dash-stat-label">
                                    {stat.label}
                                </div>
                                <div className="dash-stat-value">
                                    <Counter
                                        value={stat.value}
                                        dec={stat.dec}
                                    />
                                    <span className="dash-accent">
                                        {stat.suffix}
                                    </span>
                                </div>
                            </div>
                            <svg
                                width="118"
                                height="38"
                                viewBox="0 0 118 38"
                                fill="none"
                                style={{ flexShrink: 0, overflow: 'visible' }}
                            >
                                <polyline
                                    points={stat.spark}
                                    fill="none"
                                    stroke="var(--neon)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    opacity="0.9"
                                />
                            </svg>
                        </div>
                        <div className="dash-stat-foot">
                            <span className="dash-delta">↑ {stat.delta}</span>
                            <span className="dash-stat-sub">{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dash-grid-2 dash-overview-row">
                <div className="dash-card dash-pad">
                    <div className="dash-chart-head">
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 9,
                                }}
                            >
                                <h2 className="dash-h2">Visitors</h2>
                                <span className="dash-live">
                                    <span />
                                    LIVE
                                </span>
                            </div>
                            <div
                                style={{
                                    fontSize: 12.5,
                                    color: '#8a928d',
                                    marginTop: 3,
                                }}
                            >
                                Last 21 days ·{' '}
                                <span style={{ color: '#cdd3ce' }}>
                                    12,480 total
                                </span>
                            </div>
                        </div>
                        <div className="dash-seg">
                            {['7d', '21d', '90d'].map((r) => (
                                <button
                                    key={r}
                                    className={
                                        trafficRange === r ? 'is-active' : ''
                                    }
                                    onClick={() => setTrafficRange(r)}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ position: 'relative', marginTop: 14 }}>
                        <svg
                            viewBox="0 0 760 260"
                            width="100%"
                            height="auto"
                            preserveAspectRatio="none"
                            style={{ display: 'block', overflow: 'visible' }}
                        >
                            <defs>
                                <linearGradient
                                    id="visGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0"
                                        style={{
                                            stopColor: 'var(--neon)',
                                            stopOpacity: 0.28,
                                        }}
                                    />
                                    <stop
                                        offset="1"
                                        style={{
                                            stopColor: 'var(--neon)',
                                            stopOpacity: 0,
                                        }}
                                    />
                                </linearGradient>
                            </defs>
                            <line
                                x1="12"
                                y1="230"
                                x2="748"
                                y2="230"
                                stroke="rgba(255,255,255,.07)"
                                strokeWidth="1"
                            />
                            <line
                                x1="12"
                                y1="158"
                                x2="748"
                                y2="158"
                                stroke="rgba(255,255,255,.05)"
                                strokeWidth="1"
                                strokeDasharray="3 5"
                            />
                            <line
                                x1="12"
                                y1="86"
                                x2="748"
                                y2="86"
                                stroke="rgba(255,255,255,.05)"
                                strokeWidth="1"
                                strokeDasharray="3 5"
                            />
                            <line
                                x1="12"
                                y1="14"
                                x2="748"
                                y2="14"
                                stroke="rgba(255,255,255,.05)"
                                strokeWidth="1"
                                strokeDasharray="3 5"
                            />
                            <path
                                d={chart.area}
                                fill="url(#visGrad)"
                                style={{
                                    animation: 'dash-areaIn 1.4s ease .5s both',
                                }}
                            />
                            <path
                                className="dash-chart-line"
                                d={chart.line}
                                fill="none"
                                stroke="var(--neon)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                pathLength={1}
                            />
                            <circle
                                cx={chart.lastX}
                                cy={chart.lastY}
                                r="5.5"
                                fill="var(--neon)"
                                stroke="#070808"
                                strokeWidth="2.5"
                                style={{
                                    animation: 'dash-areaIn .5s ease 1.6s both',
                                }}
                            />
                        </svg>
                        <div className="dash-chart-x">
                            <span>21d ago</span>
                            <span>14d</span>
                            <span>7d</span>
                            <span>3d</span>
                            <span style={{ color: 'var(--neon)' }}>Today</span>
                        </div>
                    </div>
                </div>

                <div className="dash-card dash-pad">
                    <div className="dash-section-head">
                        <h2 className="dash-h2">Traffic sources</h2>
                        <span
                            className="dash-mono"
                            style={{ fontSize: 11, color: '#565d58' }}
                        >
                            30d
                        </span>
                    </div>
                    <div className="dash-sources">
                        {sources.map((src) => (
                            <div key={src.label}>
                                <div className="dash-source-top">
                                    <span className="dash-source-name">
                                        <span
                                            className="dash-source-swatch"
                                            style={{ background: src.color }}
                                        />
                                        {src.label}
                                    </span>
                                    <span className="dash-source-pct">
                                        {src.pct}%
                                    </span>
                                </div>
                                <div className="dash-track">
                                    <GrowBar
                                        className="dash-track-fill"
                                        target={`${src.pct}%`}
                                        color={src.color}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="dash-bounce">
                        <span>Bounce rate</span>
                        <span>32.4%</span>
                    </div>
                </div>
            </div>

            <div className="dash-grid-2 dash-overview-row-2">
                <div className="dash-card dash-pad">
                    <div className="dash-section-head">
                        <h2 className="dash-h2">Recent messages</h2>
                        <button
                            className="dash-link-btn"
                            onClick={() => goToView('messages')}
                        >
                            View all →
                        </button>
                    </div>
                    <div className="dash-recent">
                        {messages.slice(0, 4).map((m) => {
                            const isUnread = unread.has(m.id);

                            return (
                                <button
                                    key={m.id}
                                    className="dash-recent-item"
                                    onClick={() => goToView('messages')}
                                >
                                    <span className="dash-avatar">
                                        {m.initials}
                                    </span>
                                    <span className="dash-recent-main">
                                        <span className="dash-recent-name-row">
                                            <span
                                                className="dash-recent-name"
                                                style={{
                                                    color: isUnread
                                                        ? '#ECEFEC'
                                                        : '#a7afa9',
                                                }}
                                            >
                                                {m.name}
                                            </span>
                                            <span
                                                className="dash-unread-dot"
                                                style={{
                                                    background: isUnread
                                                        ? 'var(--neon)'
                                                        : 'transparent',
                                                }}
                                            />
                                        </span>
                                        <span className="dash-recent-preview">
                                            {m.preview}
                                        </span>
                                    </span>
                                    <span className="dash-recent-time">
                                        {m.time}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="dash-card dash-pad">
                    <h2 className="dash-h2" style={{ marginBottom: 16 }}>
                        Activity
                    </h2>
                    <div className="dash-activity">
                        {activity.map((a, i) => (
                            <div key={a.text} className="dash-activity-item">
                                <span className="dash-activity-rail">
                                    <span
                                        className="dash-activity-node"
                                        style={{ background: a.color }}
                                    />
                                    {i < activity.length - 1 && (
                                        <span className="dash-activity-line" />
                                    )}
                                </span>
                                <span style={{ minWidth: 0, paddingBottom: 2 }}>
                                    <span className="dash-activity-text">
                                        {a.text}
                                    </span>
                                    <span className="dash-activity-time">
                                        {a.time}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );

    const renderMessages = () => (
        <section key="messages" className="dash-panel">
            <div className="dash-msg-grid">
                <div className="dash-inbox">
                    <div className="dash-inbox-head">
                        <div className="dash-inbox-top">
                            <span className="dash-inbox-title">
                                Inbox{' '}
                                <span className="dash-inbox-count">
                                    {messages.length}
                                </span>
                            </span>
                            <button
                                className="dash-mark-all"
                                onClick={() => setUnread(new Set())}
                            >
                                Mark all read
                            </button>
                        </div>
                        <div className="dash-filters">
                            {(
                                ['all', 'unread', 'starred', 'replied'] as const
                            ).map((f) => (
                                <button
                                    key={f}
                                    className={`dash-filter${filter === f ? 'is-active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f[0].toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="dash-msg-list">
                        {visibleMessages.map((m) => {
                            const b = badgeFor(m.status);
                            const isUnread = unread.has(m.id);

                            return (
                                <button
                                    key={m.id}
                                    className={`dash-msg${selected?.id === m.id ? 'is-selected' : ''}`}
                                    onClick={() => openMessage(m.id)}
                                >
                                    <span className="dash-avatar">
                                        {m.initials}
                                    </span>
                                    <span className="dash-msg-main">
                                        <span className="dash-msg-row1">
                                            <span className="dash-msg-name-wrap">
                                                <span
                                                    className="dash-msg-name"
                                                    style={{
                                                        color: isUnread
                                                            ? '#ECEFEC'
                                                            : '#a7afa9',
                                                    }}
                                                >
                                                    {m.name}
                                                </span>
                                                <span
                                                    className="dash-unread-dot"
                                                    style={{
                                                        background: isUnread
                                                            ? 'var(--neon)'
                                                            : 'transparent',
                                                    }}
                                                />
                                            </span>
                                            <span className="dash-msg-time">
                                                {m.time}
                                            </span>
                                        </span>
                                        <span className="dash-msg-preview">
                                            {m.preview}
                                        </span>
                                        <span className="dash-msg-meta">
                                            <span
                                                className="dash-badge"
                                                style={{
                                                    color: b.color,
                                                    background: b.bg,
                                                }}
                                            >
                                                {b.label}
                                            </span>
                                            <span className="dash-msg-project">
                                                {m.project}
                                            </span>
                                        </span>
                                    </span>
                                    <span
                                        className="dash-star"
                                        style={{
                                            color: m.starred
                                                ? C.amber
                                                : '#2f3631',
                                        }}
                                    >
                                        ★
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="dash-detail-wrap">
                    {selected ? (
                        <div className="dash-detail">
                            <div className="dash-detail-head">
                                <div className="dash-detail-top">
                                    <span className="dash-avatar">
                                        {selected.initials}
                                    </span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="dash-detail-name">
                                            {selected.name}
                                        </div>
                                        <div className="dash-detail-email">
                                            {selected.email}
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: 8,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <button
                                            className="dash-icon-btn"
                                            title="Star"
                                            style={{
                                                color: selected.starred
                                                    ? C.amber
                                                    : '#a7afa9',
                                            }}
                                        >
                                            ★
                                        </button>
                                        <button
                                            className="dash-icon-btn"
                                            title="Archive"
                                        >
                                            <svg {...svgProps(17)}>
                                                <rect
                                                    x="3"
                                                    y="4"
                                                    width="18"
                                                    height="4"
                                                    rx="1"
                                                />
                                                <path d="M5 8v11a1 1 0 001 1h12a1 1 0 001-1V8M10 12h4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="dash-detail-chips">
                                    <span className="dash-chip">
                                        <span>Project</span> {selected.project}
                                    </span>
                                    <span className="dash-chip">
                                        <span>Budget</span> {selected.budget}
                                    </span>
                                    <span className="dash-chip">
                                        <span>Timeline</span>{' '}
                                        {selected.timeline}
                                    </span>
                                </div>
                            </div>
                            <div className="dash-detail-body">
                                <div className="dash-received">
                                    RECEIVED {selected.received}
                                </div>
                                <p>{selected.body}</p>
                                <p>{selected.body2}</p>
                            </div>
                            <div className="dash-reply">
                                <div className="dash-reply-label">
                                    QUICK REPLY
                                </div>
                                <textarea
                                    key={selected.id}
                                    ref={replyRef}
                                    rows={3}
                                    placeholder={`Write a reply to ${selected.name}…`}
                                />
                                <div className="dash-reply-actions">
                                    <button
                                        className="dash-btn-primary"
                                        onClick={sendReply}
                                    >
                                        {replySent ? 'Sent ✓' : 'Send reply →'}
                                    </button>
                                    <a
                                        href={`mailto:${selected.email}`}
                                        className="dash-btn-ghost"
                                    >
                                        Open in mail
                                    </a>
                                    {replySent && (
                                        <span className="dash-send-ok">
                                            ✓ Reply sent
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="dash-no-msg">
                            <svg
                                width="34"
                                height="34"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#2f3631"
                                strokeWidth="1.5"
                            >
                                <rect
                                    x="3"
                                    y="5"
                                    width="18"
                                    height="14"
                                    rx="2.5"
                                />
                                <path d="M3.5 7l8.5 6 8.5-6" />
                            </svg>
                            <span style={{ fontSize: 14 }}>
                                No messages match this filter
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );

    const renderProjects = () => (
        <section key="projects" className="dash-panel">
            <div className="dash-toolbar">
                <div className="dash-counts">
                    <span className="dash-count-chip">
                        Total <b>{totalProjects}</b>
                    </span>
                    <span className="dash-count-chip">
                        Published <b>{publishedProjects}</b>
                    </span>
                    <span className="dash-count-chip">
                        Draft <b className="is-muted">{draftProjects}</b>
                    </span>
                </div>
                <button
                    type="button"
                    className="dash-new-btn"
                    onClick={openCreateProject}
                >
                    <svg {...svgProps(16, 2.4)}>
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    New project
                </button>
            </div>
            <div className="dash-table">
                <div className="dash-thead">
                    <span>Project</span>
                    <span>Category</span>
                    <span>Status</span>
                    <span>Views</span>
                    <span>Actions</span>
                </div>
                {projects.map((p) => {
                    const published = p.status === 'Published';
                    const color = published ? 'var(--neon)' : '#8a928d';
                    const bg = published
                        ? 'rgba(0,255,133,.1)'
                        : 'rgba(255,255,255,.05)';

                    return (
                        <div key={p.id} className="dash-trow">
                            <div className="dash-proj-name-cell">
                                <span className="dash-proj-mono">{p.mono}</span>
                                <div style={{ minWidth: 0 }}>
                                    <div className="dash-proj-name">
                                        {p.name}
                                    </div>
                                    <div className="dash-proj-updated">
                                        Updated {p.updated}
                                    </div>
                                </div>
                            </div>
                            <span className="dash-proj-cat">{p.category}</span>
                            <span>
                                <span
                                    className="dash-status"
                                    style={{ color, background: bg }}
                                >
                                    <span style={{ background: color }} />
                                    {p.status}
                                </span>
                            </span>
                            <span className="dash-proj-views">{p.views}</span>
                            <div className="dash-row-actions">
                                <button
                                    type="button"
                                    className="dash-row-btn dash-row-btn--edit"
                                    title="Edit"
                                    onClick={() => openEditProject(p)}
                                >
                                    <svg {...svgProps(15, 1.8)}>
                                        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="dash-row-btn dash-row-btn--del"
                                    title="Delete"
                                    onClick={() => deleteProject(p)}
                                >
                                    <svg {...svgProps(15, 1.8)}>
                                        <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );

    const renderTestimonials = () => (
        <section key="testimonials" className="dash-panel">
            <div className="dash-toolbar">
                <p
                    style={{
                        margin: 0,
                        color: '#8a928d',
                        fontSize: 14,
                        maxWidth: '48ch',
                    }}
                >
                    Approve client testimonials before they appear on your
                    public site.
                </p>
                {pendingCount > 0 && (
                    <span className="dash-pending-chip">
                        <span />
                        {pendingCount} pending review
                    </span>
                )}
            </div>
            <div className="dash-testi-grid">
                {testimonials.map((t) => {
                    const isApproved = !t.pending;

                    return (
                        <figure
                            key={t.id}
                            className={`dash-testi${isApproved ? '' : 'is-pending'}`}
                        >
                            <div className="dash-testi-top">
                                <span className="dash-testi-quote-mark">
                                    &ldquo;
                                </span>
                                <span
                                    className="dash-testi-status"
                                    style={{
                                        color: isApproved
                                            ? 'var(--neon)'
                                            : C.amber,
                                        background: isApproved
                                            ? 'rgba(0,255,133,.1)'
                                            : 'rgba(255,189,46,.12)',
                                    }}
                                >
                                    <span
                                        style={{
                                            background: isApproved
                                                ? 'var(--neon)'
                                                : C.amber,
                                        }}
                                    />
                                    {isApproved ? 'Live' : 'Pending'}
                                </span>
                            </div>
                            <blockquote className="dash-testi-quote">
                                {t.quote}
                            </blockquote>
                            <figcaption className="dash-testi-foot">
                                <span className="dash-avatar">
                                    {t.initials}
                                </span>
                                <span style={{ minWidth: 0 }}>
                                    <span className="dash-testi-name">
                                        {t.name}
                                    </span>
                                    <span className="dash-testi-role">
                                        {t.role}
                                    </span>
                                </span>
                            </figcaption>
                            <div className="dash-testi-actions">
                                <button
                                    type="button"
                                    className={`dash-approve${isApproved ? 'is-approved' : ''}`}
                                    disabled={isApproved}
                                    onClick={() => approveTestimonial(t)}
                                >
                                    {isApproved ? 'Approved ✓' : 'Approve'}
                                </button>
                                <button
                                    type="button"
                                    className="dash-del-btn"
                                    title="Delete"
                                    onClick={() => deleteTestimonial(t)}
                                >
                                    <svg {...svgProps(15, 1.8)}>
                                        <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" />
                                    </svg>
                                </button>
                            </div>
                        </figure>
                    );
                })}
            </div>
        </section>
    );

    const renderAnalytics = () => (
        <section key="analytics" className="dash-panel">
            <div className="dash-an-stats">
                {analyticsStats.map((s) => (
                    <div key={s.label} className="dash-an-stat">
                        <div className="dash-stat-label">{s.label}</div>
                        <div className="dash-an-value">
                            <Counter value={s.value} dec={s.dec} />
                            <span className="dash-accent">{s.suffix}</span>
                        </div>
                        <div className="dash-stat-sub" style={{ marginTop: 7 }}>
                            {s.sub}
                        </div>
                    </div>
                ))}
            </div>
            <div className="dash-card dash-pad" style={{ marginBottom: 18 }}>
                <div className="dash-section-head" style={{ marginBottom: 22 }}>
                    <h2 className="dash-h2">Traffic by month</h2>
                    <span
                        className="dash-mono"
                        style={{ fontSize: 11, color: '#565d58' }}
                    >
                        Last 12 months
                    </span>
                </div>
                <div className="dash-bars">
                    {monthly.map((mo) => (
                        <div key={mo.m} className="dash-bar-col">
                            <div className="dash-bar-slot">
                                <GrowBar
                                    className="dash-bar"
                                    axis="h"
                                    target={mo.h}
                                />
                            </div>
                            <span className="dash-bar-label">{mo.m}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="dash-grid-2 dash-an-row">
                <div className="dash-card dash-pad">
                    <h2 className="dash-h2" style={{ marginBottom: 18 }}>
                        Top pages
                    </h2>
                    <div>
                        {topPages.map((pg) => (
                            <div key={pg.path} className="dash-toppage">
                                <span className="dash-toppage-path">
                                    {pg.path}
                                </span>
                                <span className="dash-toppage-track">
                                    <GrowBar
                                        className="dash-toppage-fill"
                                        target={pg.w}
                                    />
                                </span>
                                <span className="dash-toppage-views">
                                    {pg.views}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="dash-card dash-pad">
                    <h2 className="dash-h2" style={{ marginBottom: 20 }}>
                        Devices
                    </h2>
                    <div className="dash-devices">
                        <div
                            className="dash-donut"
                            style={{
                                background:
                                    'conic-gradient(var(--neon) 0 58%, #6fb3ff 58% 94%, #ffbd2e 94% 100%)',
                            }}
                        >
                            <div className="dash-donut-center">
                                <div>
                                    <div className="dash-donut-pct">58%</div>
                                    <div className="dash-donut-label">
                                        DESKTOP
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dash-device-legend">
                            {devices.map((d) => (
                                <div key={d.label} className="dash-device-row">
                                    <span className="dash-device-name">
                                        <span style={{ background: d.color }} />
                                        {d.label}
                                    </span>
                                    <span className="dash-device-pct">
                                        {d.pct}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    const renderSettings = () => (
        <section key="settings" className="dash-panel">
            <div className="dash-grid-2 dash-settings-row">
                <div className="dash-settings-card">
                    <h2 className="dash-settings-title">Profile</h2>
                    <p className="dash-settings-desc">
                        This information shows on your public portfolio.
                    </p>
                    <div className="dash-photo-row">
                        <img src="/portfolio/rizki.png" alt="Rizki" />
                        <div>
                            <button className="dash-change-photo">
                                Change photo
                            </button>
                            <div className="dash-photo-hint">
                                PNG or JPG · max 2MB
                            </div>
                        </div>
                    </div>
                    <div className="dash-field-grid">
                        <label className="dash-field">
                            <span className="dash-field-label">Full name</span>
                            <input
                                className="dash-input"
                                type="text"
                                defaultValue={user?.name || 'Rizki Syandana'}
                            />
                        </label>
                        <label className="dash-field">
                            <span className="dash-field-label">Role</span>
                            <input
                                className="dash-input"
                                type="text"
                                defaultValue="Web Developer Specialist"
                            />
                        </label>
                        <label className="dash-field">
                            <span className="dash-field-label">Email</span>
                            <input
                                className="dash-input"
                                type="email"
                                defaultValue={user?.email || 'hello@rizki.dev'}
                            />
                        </label>
                        <label className="dash-field">
                            <span className="dash-field-label">Location</span>
                            <input
                                className="dash-input"
                                type="text"
                                defaultValue="Indonesia · Remote"
                            />
                        </label>
                    </div>
                    <label className="dash-field dash-field-full">
                        <span className="dash-field-label">Bio</span>
                        <textarea
                            className="dash-textarea"
                            rows={3}
                            defaultValue="Web developer specialist building fast, accessible, and genuinely delightful websites."
                        />
                    </label>
                    <div className="dash-settings-actions">
                        <button
                            className="dash-save-btn"
                            onClick={() => {
                                setSavedFlash(true);
                                window.setTimeout(
                                    () => setSavedFlash(false),
                                    2000,
                                );
                            }}
                        >
                            {savedFlash ? 'Saved ✓' : 'Save changes'}
                        </button>
                        <button className="dash-cancel-btn">Cancel</button>
                    </div>
                </div>

                <div className="dash-settings-col">
                    <div className="dash-settings-card">
                        <h2 className="dash-h2" style={{ marginBottom: 18 }}>
                            Preferences
                        </h2>
                        <div className="dash-prefs">
                            {initialPrefs.map((pr, i) => (
                                <div key={pr.label} className="dash-pref">
                                    <div style={{ minWidth: 0 }}>
                                        <div className="dash-pref-label">
                                            {pr.label}
                                        </div>
                                        <div className="dash-pref-desc">
                                            {pr.desc}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={prefs[i]}
                                        aria-label={pr.label}
                                        className={`dash-switch dash-switch--pref${prefs[i] ? 'is-on' : ''}`}
                                        onClick={() =>
                                            setPrefs((prev) =>
                                                prev.map((v, j) =>
                                                    j === i ? !v : v,
                                                ),
                                            )
                                        }
                                    >
                                        <span className="dash-switch-knob" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="dash-settings-card">
                        <h2 className="dash-h2" style={{ marginBottom: 6 }}>
                            Accent color
                        </h2>
                        <p
                            className="dash-settings-desc"
                            style={{ marginBottom: 16 }}
                        >
                            Used across your portfolio and this dashboard.
                        </p>
                        <div className="dash-accents">
                            {accents.map((ac) => (
                                <button
                                    key={ac}
                                    className={`dash-accent-sw${accent === ac ? 'is-active' : ''}`}
                                    style={{ background: ac }}
                                    onClick={() => setAccent(ac)}
                                    aria-label={`Accent ${ac}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="dash-plan">
                        <div className="dash-plan-eyebrow">PLAN · PRO</div>
                        <p>
                            Custom domain, unlimited projects, and detailed
                            analytics are active.
                        </p>
                        <button>Manage subscription</button>
                    </div>
                </div>
            </div>
        </section>
    );

    const renderView = (name: ViewName) => {
        switch (name) {
            case 'overview':
                return renderOverview();
            case 'messages':
                return renderMessages();
            case 'projects':
                return renderProjects();
            case 'testimonials':
                return renderTestimonials();
            case 'analytics':
                return renderAnalytics();
            case 'settings':
                return renderSettings();
        }
    };

    const head = (
        <Head title={exportMode ? 'Dashboard — All Views' : 'Admin Dashboard'}>
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
    );

    /* ----------------------------------------------- export (print) layout --- */

    if (exportMode) {
        return (
            <>
                {head}
                <div className="dash dash-print" style={rootStyle}>
                    <div className="dash-print-cover">
                        <div className="dash-print-eyebrow">
                            RIZKI.DEV — ADMIN DASHBOARD
                        </div>
                        <div className="dash-print-title">
                            All views — full export
                        </div>
                        <div className="dash-print-sub">
                            6 screens · Overview · Messages · Projects ·
                            Testimonials · Analytics · Settings
                        </div>
                    </div>
                    {navOrder.map((name, i) => (
                        <section key={name} className="dash-print-section">
                            <div className="dash-print-head">
                                <span className="dash-print-num">{`0${i + 1}`}</span>
                                <span className="dash-print-name">
                                    {viewLabels[name]}
                                </span>
                                <span className="dash-print-desc">
                                    {printSubs[name]}
                                </span>
                            </div>
                            {renderView(name)}
                        </section>
                    ))}
                </div>
            </>
        );
    }

    /* ----------------------------------------------------- interactive app --- */

    return (
        <>
            {head}
            <div className="dash" style={rootStyle}>
                <div
                    className={`dash-backdrop${isMobile && navOpen ? 'is-open' : ''}`}
                    onClick={() => setNavOpen(false)}
                />

                {/* SIDEBAR */}
                <aside
                    className="dash-sidebar"
                    style={{
                        width: sidebarWidth,
                        transform: isMobile
                            ? navOpen
                                ? 'translateX(0)'
                                : 'translateX(-100%)'
                            : 'translateX(0)',
                        boxShadow:
                            isMobile && navOpen
                                ? '0 0 60px rgba(0,0,0,.6)'
                                : 'none',
                    }}
                >
                    <div className="dash-brand">
                        <span className="dash-logo-badge">RS</span>
                        {showLabels && (
                            <span className="dash-brand-text">
                                <span className="dash-brand-name">
                                    rizki
                                    <span className="dash-accent">.dev</span>
                                </span>
                                <span className="dash-brand-sub">
                                    ADMIN PANEL
                                </span>
                            </span>
                        )}
                        {!isMobile && (
                            <button
                                className={`dash-collapse${collapsed ? 'is-rotated' : ''}`}
                                aria-label="Collapse sidebar"
                                onClick={() => setCollapsedPref((c) => !c)}
                            >
                                <svg {...svgProps(15, 2)}>
                                    <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {showLabels && <div className="dash-menu-label">MENU</div>}
                    <nav className="dash-nav">
                        {navOrder.map((name) => {
                            const isActive = view === name;
                            const badge =
                                name === 'messages' && unreadCount > 0
                                    ? {
                                          text: String(unreadCount),
                                          amber: false,
                                      }
                                    : name === 'testimonials' &&
                                        pendingCount > 0
                                      ? {
                                            text: String(pendingCount),
                                            amber: true,
                                        }
                                      : null;

                            return (
                                <button
                                    key={name}
                                    type="button"
                                    className={`dash-nav-item${isActive ? 'is-active' : ''}`}
                                    title={viewLabels[name]}
                                    onClick={() => goToView(name)}
                                >
                                    <span className="dash-nav-ind" />
                                    {viewIcons[name]}
                                    {showLabels && (
                                        <span className="dash-nav-label">
                                            {viewLabels[name]}
                                        </span>
                                    )}
                                    {showLabels && badge && (
                                        <span
                                            className={`dash-nav-badge${badge.amber ? 'dash-nav-badge--amber' : ''}`}
                                        >
                                            {badge.text}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="dash-side-foot">
                        <div className="dash-avail-card">
                            <div className="dash-avail-row">
                                <span className="dash-avail-name">
                                    <span
                                        className={`dash-avail-dot${availability ? '' : 'is-off'}`}
                                    />
                                    {showLabels && (
                                        <span>
                                            {availability
                                                ? 'Available'
                                                : 'Unavailable'}
                                        </span>
                                    )}
                                </span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={availability}
                                    aria-label="Toggle availability"
                                    className={`dash-switch${availability ? 'is-on' : ''}`}
                                    onClick={() => setAvailability((a) => !a)}
                                >
                                    <span className="dash-switch-knob" />
                                </button>
                            </div>
                            {showLabels && (
                                <div className="dash-avail-note">
                                    Shown on your public site
                                </div>
                            )}
                        </div>
                        {showLabels && (
                            <Link href="/" prefetch className="dash-live-link">
                                View live site
                                <svg {...svgProps(14, 2)}>
                                    <path d="M7 17L17 7M9 7h8v8" />
                                </svg>
                            </Link>
                        )}
                        {showLabels && (
                            <Link
                                href="/dashboard/print"
                                prefetch
                                className="dash-live-link"
                                style={{ marginTop: 10 }}
                            >
                                Export all views
                                <svg {...svgProps(14, 1.7)}>
                                    <path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-4a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-2M6 14h12v7H6z" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </aside>

                {/* MAIN */}
                <div className="dash-main" style={{ marginLeft: mainMargin }}>
                    <header className="dash-topbar">
                        <button
                            className={`dash-hamburger${isMobile ? 'is-visible' : ''}`}
                            aria-label="Open menu"
                            onClick={() => setNavOpen(true)}
                        >
                            <svg {...svgProps(18, 2)}>
                                <path d="M3 6h18M3 12h18M3 18h18" />
                            </svg>
                        </button>
                        <div style={{ minWidth: 0 }}>
                            <h1 className="dash-title">{viewLabels[view]}</h1>
                            <div className="dash-subtitle">
                                {subtitle[view]}
                            </div>
                        </div>
                        <div className="dash-spacer" />
                        <label className="dash-search">
                            <svg
                                {...svgProps(17, 2, '#8a928d')}
                                style={{ flexShrink: 0 }}
                            >
                                <circle cx="11" cy="11" r="7" />
                                <path d="M21 21l-4-4" />
                            </svg>
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search messages…"
                                value={search}
                                onChange={(e) => onGlobalSearch(e.target.value)}
                            />
                            {showLabels && <kbd className="dash-kbd">/</kbd>}
                        </label>
                        <button
                            className="dash-bell"
                            aria-label="Notifications"
                        >
                            <svg {...svgProps(19)}>
                                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="dash-bell-dot" />
                            )}
                        </button>
                        <div className="dash-profile-wrap">
                            <button
                                type="button"
                                className="dash-profile"
                                onClick={() => setProfileOpen((o) => !o)}
                            >
                                <img
                                    src="/portfolio/rizki.png"
                                    alt={user?.name || 'Profile'}
                                />
                                <span className="dash-profile-name">
                                    <b>{user?.name || 'Rizki S.'}</b>
                                    <span>Owner</span>
                                </span>
                                <svg
                                    {...svgProps(15, 2, '#8a928d')}
                                    style={{ flexShrink: 0 }}
                                >
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                            {profileOpen && (
                                <>
                                    <button
                                        type="button"
                                        aria-label="Close menu"
                                        onClick={() => setProfileOpen(false)}
                                        style={{
                                            position: 'fixed',
                                            inset: 0,
                                            zIndex: 55,
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'default',
                                        }}
                                    />
                                    <div className="dash-profile-menu">
                                        <div className="dash-profile-menu-head">
                                            <b>{user?.name || 'Rizki S.'}</b>
                                            <span>
                                                {user?.email ||
                                                    'hello@rizki.dev'}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            className="dash-profile-menu-item"
                                            onClick={() => {
                                                setProfileOpen(false);
                                                goToView('settings');
                                            }}
                                        >
                                            <SettingsIcon size={16} />
                                            Settings
                                        </button>
                                        <Link
                                            href={logout()}
                                            as="button"
                                            className="dash-profile-menu-item dash-profile-menu-item--danger"
                                        >
                                            <LogOut size={16} />
                                            Log out
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </header>

                    <main className="dash-content">{renderView(view)}</main>
                </div>

                {projectModal.open && (
                    <div
                        role="dialog"
                        aria-modal="true"
                        onClick={closeProjectModal}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 80,
                            background: 'rgba(0,0,0,.62)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            padding: '6vh 16px',
                            overflowY: 'auto',
                        }}
                    >
                        <form
                            onClick={(e) => e.stopPropagation()}
                            onSubmit={submitProject}
                            className="dash-card"
                            style={{
                                width: '100%',
                                maxWidth: 540,
                                padding: 24,
                            }}
                        >
                            <h2
                                className="dash-h2"
                                style={{ marginBottom: 18 }}
                            >
                                {projectModal.editing
                                    ? 'Edit project'
                                    : 'New project'}
                            </h2>

                            <div style={{ marginBottom: 14 }}>
                                <label style={fieldLabelStyle}>Title</label>
                                <input
                                    type="text"
                                    value={projectForm.data.title}
                                    onChange={(e) =>
                                        projectForm.setData(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    style={fieldInputStyle}
                                />
                                {projectForm.errors.title && (
                                    <div style={fieldErrorStyle}>
                                        {projectForm.errors.title}
                                    </div>
                                )}
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 110px',
                                    gap: 12,
                                    marginBottom: 14,
                                }}
                            >
                                <div>
                                    <label style={fieldLabelStyle}>
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        value={projectForm.data.category}
                                        onChange={(e) =>
                                            projectForm.setData(
                                                'category',
                                                e.target.value,
                                            )
                                        }
                                        style={fieldInputStyle}
                                    />
                                    {projectForm.errors.category && (
                                        <div style={fieldErrorStyle}>
                                            {projectForm.errors.category}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={fieldLabelStyle}>Year</label>
                                    <input
                                        type="text"
                                        maxLength={4}
                                        value={projectForm.data.year}
                                        onChange={(e) =>
                                            projectForm.setData(
                                                'year',
                                                e.target.value,
                                            )
                                        }
                                        style={fieldInputStyle}
                                    />
                                    {projectForm.errors.year && (
                                        <div style={fieldErrorStyle}>
                                            {projectForm.errors.year}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ marginBottom: 14 }}>
                                <label style={fieldLabelStyle}>Status</label>
                                <select
                                    value={projectForm.data.status}
                                    onChange={(e) =>
                                        projectForm.setData(
                                            'status',
                                            e.target.value as
                                                | 'draft'
                                                | 'published',
                                        )
                                    }
                                    style={fieldInputStyle}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: 14 }}>
                                <label style={fieldLabelStyle}>
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={projectForm.data.description}
                                    onChange={(e) =>
                                        projectForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    style={{
                                        ...fieldInputStyle,
                                        resize: 'vertical',
                                    }}
                                />
                                {projectForm.errors.description && (
                                    <div style={fieldErrorStyle}>
                                        {projectForm.errors.description}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: 14 }}>
                                <label style={fieldLabelStyle}>
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    placeholder="React, Laravel, MySQL"
                                    value={projectForm.data.tags}
                                    onChange={(e) =>
                                        projectForm.setData(
                                            'tags',
                                            e.target.value,
                                        )
                                    }
                                    style={fieldInputStyle}
                                />
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <label style={fieldLabelStyle}>
                                    Image{' '}
                                    {projectModal.editing?.imageUrl &&
                                        '(leave empty to keep current)'}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        projectForm.setData(
                                            'image',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    style={{ ...fieldInputStyle, padding: 8 }}
                                />
                                {projectForm.errors.image && (
                                    <div style={fieldErrorStyle}>
                                        {projectForm.errors.image}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: 10 }}>
                                <button
                                    type="submit"
                                    className="dash-btn-primary"
                                    disabled={projectForm.processing}
                                >
                                    {projectForm.processing
                                        ? 'Saving…'
                                        : projectModal.editing
                                          ? 'Save changes'
                                          : 'Create project'}
                                </button>
                                <button
                                    type="button"
                                    className="dash-btn-ghost"
                                    onClick={closeProjectModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}
