/**
 * Frontend mirrors of the API Resources in app/Http/Resources.
 * Keep these in sync with the corresponding *Resource::toArray().
 */

export interface Stat {
    value: number;
    suffix: string;
    label: string;
}

export interface Fact {
    k: string;
    v: string;
}

export interface Profile {
    name: string;
    role: string | null;
    tagline: string | null;
    bio: string | null;
    location: string | null;
    experience: string | null;
    focus: string | null;
    availabilityStatus: string | null;
    email: string | null;
    avatarUrl: string | null;
    stats: Stat[];
    facts: Fact[];
}

export interface Project {
    id: number;
    title: string;
    slug: string;
    category: string;
    year: string | null;
    description: string | null;
    tags: string[];
    imageUrl: string | null;
    status: string;
    statusLabel: string;
    views: number;
    sortOrder: number;
    updatedAt: string | null;
}

export interface Skill {
    id: number;
    name: string;
    category: string;
    inTicker: boolean;
    sortOrder: number;
}

export interface Service {
    id: number;
    title: string;
    description: string | null;
    points: string[];
    sortOrder: number;
}

export interface Testimonial {
    id: number;
    authorName: string;
    authorRole: string | null;
    quote: string;
    initials: string;
    avatarUrl: string | null;
    status: string;
    statusLabel: string;
    sortOrder: number;
}

export interface SocialLink {
    id: number;
    label: string;
    handle: string;
    url: string;
    sortOrder: number;
}

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    initials: string;
    subject: string | null;
    body: string;
    preview: string;
    budget: string | null;
    timeline: string | null;
    status: string;
    statusLabel: string;
    starred: boolean;
    createdAt: string | null;
    receivedHuman: string | null;
}
