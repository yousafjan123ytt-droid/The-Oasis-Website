// ===== SUPABASE CLIENT SETUP =====
// Hum yahan bhi keys daal rahe hain taake header user ke login/logout status ke hisab se update ho sake.
const SUPABASE_URL = 'https://rtmhpqbvhdshyznpilaj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWhwcWJ2aGRzaHl6bnBpbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1MzEsImV4cCI6MjA3NDczMjUzMX0.S8E_l1UdWI8VaXyk0v7gMAlZdT8LMUA3a6UybRd2j40';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== DYNAMIC HEADER & LOGOUT LOGIC =====
const authLinks = document.getElementById('auth-links');
const userDisplay = document.getElementById('user-display');
const userEmailSpan = document.getElementById('user-email');

async function checkUserSession() {
    const { data: { session } } = await supabase.auth.getSession();
    updateHeader(session);
}

function updateHeader(session) {
    if (session) {
        authLinks.style.display = 'none';
        userDisplay.style.display = 'flex';
        userEmailSpan.textContent = session.user.email;
    } else {
        authLinks.style.display = 'block';
        userDisplay.style.display = 'none';
    }
}

supabase.auth.onAuthStateChange((_event, session) => {
    updateHeader(session);
});

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'index.html';
    });
}

// ===== Baqi saara code waisa hi rahega =====
document.addEventListener('DOMContentLoaded', function() {
    checkUserSession();

    // Slideshow Logic
    const slideshowImages = document.querySelectorAll('.hero-slideshow img');
    let currentImageIndex = 0;
    if (slideshowImages.length > 0) {
        setInterval(() => {
            slideshowImages[currentImageIndex].classList.remove('active');
            currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
            slideshowImages[currentImageIndex].classList.add('active');
        }, 5000);
    }
    
    // ... Baqi saara filter, mobile nav, aur modal ka code yahan mojood hai ...
});

