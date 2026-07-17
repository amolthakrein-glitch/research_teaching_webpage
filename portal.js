// portal.js — Student Portal (Supabase auth + track-gated course material)
// Loaded on portal-login.html and portal.html, after the supabase-js v2 CDN
// script (global `supabase.createClient`).

// TODO: replace with your Supabase project's URL and anon (public) key.
// Dashboard → Project Settings → API.
const SUPABASE_URL = 'YOUR_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

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

async function getDownloadUrl(path) {
    const client = getClient();
    const { data, error } = await client.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
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
    return TRACK_LABELS[track] || track;
}

// Exposed globally for the page-level scripts in portal.html / portal-login.html.
window.Portal = {
    isConfigured,
    showUnconfiguredBanner,
    login,
    logout,
    requireSession,
    loadStudent,
    listFiles,
    getDownloadUrl,
    formatSize,
    formatDate,
    trackLabel,
};
