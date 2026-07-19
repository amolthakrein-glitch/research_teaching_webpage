// portal.js — Student Portal (Supabase auth + track-gated course material)
// Loaded on portal-login.html and portal.html, after the supabase-js v2 CDN
// script (global `supabase.createClient`).

// TODO: replace with your Supabase project's URL and anon (public) key.
// Dashboard → Project Settings → API.
const SUPABASE_URL = 'YOUR_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

const OPEN_ACCESS = true; // interim: no password required. Set to false to restore login.

const LOCAL_MODE = true; // serve materials/ from this repo, no auth. Set false when Supabase is configured.

const BUCKET = 'course-material';
const SIGNED_URL_TTL = 3600; // seconds

function isConfigured() {
    return SUPABASE_URL !== 'YOUR_PROJECT_URL' && SUPABASE_ANON_KEY !== 'YOUR_ANON_KEY';
}

let _client = null;
function getClient() {
    if (!isConfigured()) return null;
    if (!_client) {
        _client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return _client;
}

function showUnconfiguredBanner() {
    const banner = document.getElementById('portal-config-banner');
    if (banner) {
        banner.hidden = false;
        banner.textContent = 'Portal not yet configured. Please check back soon.';
    }
    const form = document.getElementById('login-form');
    if (form) {
        Array.from(form.elements).forEach((el) => { el.disabled = true; });
    }
}

function friendlyAuthError(error) {
    if (!error) return 'Something went wrong. Please try again.';
    const msg = (error.message || '').toLowerCase();
    if (msg.includes('invalid login credentials') || msg.includes('invalid') ) {
        return 'Incorrect email or password. Please try again.';
    }
    if (msg.includes('failed to fetch') || msg.includes('network')) {
        return 'Network error — please check your connection and try again.';
    }
    if (msg.includes('email not confirmed')) {
        return 'Please confirm your email before logging in.';
    }
    return error.message || 'Login failed. Please try again.';
}

// ── Auth ────────────────────────────────────────────────────────────────

async function login(email, password) {
    const client = getClient();
    if (!client) return { error: 'Portal not yet configured.' };
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { error: friendlyAuthError(error) };
    return { data };
}

async function logout() {
    const client = getClient();
    if (client) await client.auth.signOut();
    window.location.href = 'portal-login.html';
}

// Returns the current session, or null (also null when unconfigured).
async function getSession() {
    const client = getClient();
    if (!client) return null;
    const { data: { session } } = await client.auth.getSession();
    return session;
}

// Guards portal.html: redirects to login if there's no active session.
// Returns the session on success.
async function requireSession() {
    const client = getClient();
    if (!client) {
        showUnconfiguredBanner();
        return null;
    }
    const { data: { session } } = await client.auth.getSession();
    if (!session) {
        window.location.href = 'portal-login.html';
        return null;
    }
    return session;
}

// ── Data ────────────────────────────────────────────────────────────────

async function loadStudent(userId) {
    const client = getClient();
    const { data, error } = await client
        .from('students')
        .select('full_name, class_track')
        .eq('id', userId)
        .single();
    if (error) return { error: error.message };
    return { data };
}

async function listFiles(folder) {
    const client = getClient();
    const { data, error } = await client.storage.from(BUCKET).list(folder, {
        sortBy: { column: 'name', order: 'asc' },
    });
    if (error) return { error: error.message };
    // Filter out storage "keep" placeholder files and folders (no metadata).
    const files = (data || []).filter((f) => f.id && f.name !== '.emptyFolderPlaceholder');
    return { data: files.map((f) => ({ ...f, path: `${folder}/${f.name}` })) };
}

// Local-materials mode: reads materials/manifest.json instead of Supabase
// storage. Returns the same {data} / {error} shape as listFiles() above so
// the renderer in portal.html can treat local and Supabase entries alike.
async function listLocalFiles(track) {
    try {
        const res = await fetch('materials/manifest.json', { cache: 'no-store' });
        if (!res.ok) return { error: `Could not load materials manifest (${res.status}).` };
        const manifest = await res.json();
        const entries = manifest[track] || [];
        const files = entries.map((entry) => ({
            name: entry.name,
            path: entry.file,
            metadata: { size: entry.size },
            created_at: entry.date,
            local: true,
        }));
        return { data: files };
    } catch (err) {
        return { error: err.message || 'Could not load local materials.' };
    }
}

// A track is JEE/NEET prep if it's the foundation track or ends in -jee/-neet
// (matches the naming generate_material.py uses: class{grade}-jee, class{grade}-neet).
// Everything else (class6-math ... class12-<subject>) is regular school material.
function isJeeNeetTrack(track) {
    return track === 'foundation-10' || /-(jee|neet)$/.test(track);
}

async function fetchManifest() {
    const res = await fetch('materials/manifest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`Could not load materials manifest (${res.status}).`);
    return res.json();
}

// Track list for the open-access "School" dropdown — grade 6-12 subject tracks only,
// excludes common and any JEE/NEET prep tracks (those get their own dropdown/tab).
async function listTracks() {
    try {
        const manifest = await fetchManifest();
        return { data: Object.keys(manifest).filter((t) => t !== 'common' && !isJeeNeetTrack(t)) };
    } catch (err) {
        return { error: err.message || 'Could not load track list.' };
    }
}

// Track list for the open-access "JEE/NEET" dropdown.
async function listJeeNeetTracks() {
    try {
        const manifest = await fetchManifest();
        return { data: Object.keys(manifest).filter(isJeeNeetTrack) };
    } catch (err) {
        return { error: err.message || 'Could not load track list.' };
    }
}

async function getDownloadUrl(path) {
    const client = getClient();
    const { data, error } = await client.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL, { download: true });
    if (error) return { error: error.message };
    return { data: data.signedUrl };
}

// ── Formatting helpers ─────────────────────────────────────────────────

function formatSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
        size /= 1024;
        i += 1;
    }
    return `${size.toFixed(size < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const TRACK_LABELS = {
    'foundation-10': 'Foundation (Class 10)',
    'class11-neet': 'Class 11 — NEET',
    'class11-jee': 'Class 11 — JEE',
    'class12-neet': 'Class 12 — NEET',
    'class12-jee': 'Class 12 — JEE',
};

function trackLabel(track) {
    if (TRACK_LABELS[track]) return TRACK_LABELS[track];
    // Fallback: prettify slug — split on -/_, title-case, uppercase jee/neet
    const special = new Set(['jee', 'neet']);
    const parts = track.replace(/[-_]/g, ' ').split(/\s+/);
    return parts.map(p => special.has(p.toLowerCase()) ? p.toUpperCase() : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
}

// Exposed globally for the page-level scripts in portal.html / portal-login.html.
window.Portal = {
    OPEN_ACCESS,
    LOCAL_MODE,
    isConfigured,
    showUnconfiguredBanner,
    login,
    logout,
    getSession,
    requireSession,
    loadStudent,
    listFiles,
    listLocalFiles,
    listTracks,
    listJeeNeetTracks,
    isJeeNeetTrack,
    getDownloadUrl,
    formatSize,
    formatDate,
    trackLabel,
    TRACK_LABELS,
};
