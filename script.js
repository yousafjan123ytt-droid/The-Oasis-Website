// ===== HISSA 1: SUPABASE CONNECTION (SECURE & CORRECT) =====
// IMPORTANT: Apni Supabase URL aur Key yahan daalein.
// Yeh keys aapko Supabase project settings mein "API" section mein milengi.
const supabaseUrl = 'YOUR_SUPABASE_URL'; // <-- YAHAN APNA URL DAALEIN
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // <-- YAHAN APNI KEY DAALEIN

// Supabase client ko initialize karein
const { createClient } = window.supabase;
const supabase = createClient(supabaseUrl, supabaseKey);


// ===== HISSA 2: USER-FRIENDLY NOTIFICATIONS =====
/**
 * Screen par messages dikhanay ke liye function.
 * @param {string} message - Dikhane wala paigham.
 * @param {boolean} isError - Kya yeh ek error message hai?
 */
function showMessage(message, isError = false) {
    const messageBar = document.getElementById('message-bar');
    if (!messageBar) return;
    messageBar.textContent = message;
    messageBar.className = isError ? 'message-bar error' : 'message-bar success';
    messageBar.style.display = 'block';

    // 5 second ke baad message hata dein
    setTimeout(() => {
        messageBar.style.display = 'none';
    }, 5000);
}


// ===== HISSA 3: AUTHENTICATION & SESSION MANAGEMENT =====

/**
 * User ke login status ko check karta hai aur UI update karta hai.
 */
async function checkAuthState() {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    const userDisplay = document.getElementById('user-display');
    const authLinks = document.getElementById('auth-links');

    if (user && userDisplay && authLinks) {
        // User logged in hai
        document.getElementById('user-email').textContent = user.email;
        userDisplay.style.display = 'flex';
        authLinks.style.display = 'none';
    } else if (userDisplay && authLinks) {
        // User logged out hai
        userDisplay.style.display = 'none';
        authLinks.style.display = 'block';
    }
}

/**
 * User ko logout karta hai.
 */
async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        showMessage('Logout failed: ' + error.message, true);
    } else {
        showMessage('You have been logged out successfully.');
        // Page ko refresh karein ya homepage par bhej dein
        window.location.href = 'index.html';
    }
}

/**
 * Sign up form ko handle karta hai.
 */
async function handleSignUp(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const submitBtn = event.target.querySelector('button[type="submit"]');

    if (password.length < 6) {
        showMessage("Password must be at least 6 characters long.", true);
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        showMessage(`Signup failed: ${error.message}`, true);
    } else {
        showMessage("Signup successful! Please check your email to verify your account.");
        setTimeout(() => { window.location.href = "login.html"; }, 2000);
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Account';
}

/**
 * Login form ko handle karta hai.
 */
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const submitBtn = event.target.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging In...';

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        showMessage(`Login failed: ${error.message}`, true);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    } else {
        window.location.href = 'index.html';
    }
}


// ===== HISSA 4: CORE LOGIC (JOBS & EDUCATION) =====

// --- JOB RELATED FUNCTIONS ---

/**
 * Yeh function job cards ko screen par dikhata hai.
 */
function renderJobs(jobs, title = 'Opportunities Found') {
    const container = document.querySelector('.job-listings');
    if (!container) return;
    if (!jobs || jobs.length === 0) {
        container.innerHTML = '<h2>No opportunities found. Please try different search criteria.</h2>';
        return;
    }
    container.innerHTML = `<h2>${jobs.length} ${title}</h2>`;
    jobs.forEach(job => {
        const companyName = job.companies?.name ?? job.company_name ?? 'A Confidential Company';
        const companyUrl = job.companies?.website_url ?? job.company_website_url ?? '#';
        
        const jobCardHTML = `
            <article class="job-card">
                <div class="job-card-header">
                    <h3>${job.title ?? 'No Title'}</h3>
                </div>
                <div class="job-card-company">
                    <a href="${companyUrl}" target="_blank" rel="noopener noreferrer">${companyName}</a> - <span>${job.location ?? 'N/A'}</span>
                </div>
                <p class="job-summary">${job.job_summary_text ?? 'No summary available.'}</p>
                <div class="job-card-footer">
                    <span class="job-type">${job.job_type ?? 'N/A'}</span>
                    <a href="${job.source_url ?? '#'}" target="_blank" rel="noopener noreferrer" class="details-btn">View Details</a>
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', jobCardHTML);
    });
}


/**
 * Filters ke hisab se jobs load karta hai.
 */
async function loadJobsByFilter() {
    const container = document.querySelector('.job-listings');
    if (!container) return;
    container.innerHTML = '<h2>Loading jobs...</h2>';

    const jobType = document.getElementById('job-type').value;
    const experience = document.getElementById('experience-level').value;

    let query = supabase.from('jobs').select(`*, companies (name, website_url)`);

    if (jobType !== 'all') query = query.eq('job_type', jobType);
    if (experience !== 'all') query = query.eq('experience_level', experience);

    const { data, error } = await query.order('created_at', { ascending: false }).limit(20);

    if (error) {
        console.error('Error fetching jobs:', error);
        container.innerHTML = '<h2 style="color:red;">Error loading jobs. Please check the console.</h2>';
        return;
    }
    renderJobs(data, 'Filtered Jobs');
}

// --- EDUCATION RELATED FUNCTIONS ---

/**
 * Yeh function education cards (admissions, scholarships, etc.) ko screen par dikhata hai.
 */
function renderEducation(items, title = 'Opportunities Found') {
    const container = document.querySelector('.education-listings');
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = '<h2>No educational opportunities found for this criteria.</h2>';
        return;
    }

    container.innerHTML = `<h2>${items.length} ${title}</h2>`;
    items.forEach(item => {
        const cardHTML = `
            <article class="edu-card"> <!-- Use a different class for styling if needed -->
                <div class="edu-card-header">
                    <h3>${item.title ?? 'No Title'}</h3>
                    <span class="edu-category">${item.category ?? 'N/A'}</span>
                </div>
                <div class="edu-card-institution">
                    <strong>${item.institution ?? 'Institution Not Specified'}</strong> - <span>${item.city ?? 'N/A'}</span>
                </div>
                <p class="edu-summary">${item.summary ?? 'No summary available.'}</p>
                <div class="edu-card-footer">
                    <span>Deadline: ${new Date(item.deadline).toLocaleDateString()}</span>
                    <a href="${item.source_url ?? '#'}" target="_blank" rel="noopener noreferrer" class="details-btn">View Details</a>
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}


/**
 * Filters ke hisab se education opportunities load karta hai.
 */
async function loadEducationByFilter() {
    const container = document.querySelector('.education-listings');
    if (!container) return;
    container.innerHTML = '<h2>Loading educational opportunities...</h2>';

    const category = document.getElementById('edu-category').value;
    const city = document.getElementById('edu-city').value;

    // IMPORTANT: Apni Supabase table ka naam 'education' rakhein ya isay tabdeel karein
    let query = supabase.from('education').select('*');

    if (category !== 'all') query = query.eq('category', category);
    if (city !== 'all') query = query.eq('city', city);

    const { data, error } = await query.order('deadline', { ascending: true }).limit(20);

    if (error) {
        console.error('Error fetching education data:', error);
        container.innerHTML = '<h2 style="color:red;">Error loading data. Please check the console.</h2>';
        return;
    }
    renderEducation(data, 'Filtered Opportunities');
}


// --- UNIVERSAL SEARCH FUNCTION ---
/**
 * Main search bar ko handle karta hai. Yeh active tab ke hisab se search karega.
 */
async function handleDeepSearch() {
    const searchTerm = document.getElementById('search-title').value.trim();
    if (!searchTerm) {
        // Agar search khali hai, to default filters load karein
        loadJobsByFilter();
        loadEducationByFilter(); // Load both just in case
        return;
    }

    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;

    if (activeTab === 'jobs-content') {
        const container = document.querySelector('.job-listings');
        container.innerHTML = '<h2>Searching jobs...</h2>';
        // IMPORTANT: Apne Supabase RPC function ka naam 'search_jobs' rakhein
        const { data, error } = await supabase.rpc('search_jobs', { search_term: searchTerm });
        if (error) {
            console.error('Error searching jobs:', error);
            container.innerHTML = '<h2 style="color:red;">An error occurred during search.</h2>';
        } else {
            renderJobs(data, 'Search Results');
        }
    } else if (activeTab === 'education-content') {
        const container = document.querySelector('.education-listings');
        container.innerHTML = '<h2>Searching education...</h2>';
         // IMPORTANT: Apne Supabase RPC function ka naam 'search_education' rakhein
        const { data, error } = await supabase.rpc('search_education', { search_term: searchTerm });
         if (error) {
            console.error('Error searching education:', error);
            container.innerHTML = '<h2 style="color:red;">An error occurred during search.</h2>';
        } else {
            renderEducation(data, 'Search Results');
        }
    }
}


// ===== HISSA 5: UI HELPERS & EVENT LISTENERS =====

/**
 * Hero section ke slideshow ko start karta hai.
 */
function startSlideshow() {
    const images = document.querySelectorAll('.hero-slideshow img');
    if (images.length === 0) return;
    let currentImageIndex = 0;
    setInterval(() => {
        images[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].classList.add('active');
    }, 5000); // Har 5 second mein image badle
}

// --- MAIN EVENT LISTENER ---
// Jab poora page load ho jaye, to yeh function chalega.
document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selection ---
    // Universal
    const searchInput = document.getElementById('search-title');
    const searchBtn = document.querySelector('.search-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // Job Elements
    const jobListingsContainer = document.querySelector('.job-listings');
    const jobTypeFilter = document.getElementById('job-type');
    const experienceFilter = document.getElementById('experience-level');

    // Education Elements
    const eduListingsContainer = document.querySelector('.education-listings');
    const eduCategoryFilter = document.getElementById('edu-category');
    const eduCityFilter = document.getElementById('edu-city');
    
    // Auth Forms
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    
    // Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // --- Initial Setup ---
    checkAuthState();
    startSlideshow();
    
    // Initial data load (sirf agar main page par hain)
    if (jobListingsContainer) loadJobsByFilter();
    if (eduListingsContainer) loadEducationByFilter();

    // --- Event Listeners ---
    // Search
    if (searchBtn) searchBtn.addEventListener('click', handleDeepSearch);
    if (searchInput) searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleDeepSearch();
    });

    // Logout
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    
    // Job Filters
    if (jobTypeFilter) jobTypeFilter.addEventListener('change', loadJobsByFilter);
    if (experienceFilter) experienceFilter.addEventListener('change', loadJobsByFilter);

    // Education Filters
    if (eduCategoryFilter) eduCategoryFilter.addEventListener('change', loadEducationByFilter);
    if (eduCityFilter) eduCityFilter.addEventListener('change', loadEducationByFilter);

    // Auth Forms
    if (signupForm) signupForm.addEventListener('submit', handleSignUp);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Tab Functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabContents.forEach(content => content.classList.remove('active'));
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });
});

