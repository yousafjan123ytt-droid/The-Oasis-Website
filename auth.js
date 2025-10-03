// ===== HISSA 1: SUPABASE CONNECTION =====
// Vercel Environment Variables se keys haasil karne ka mehfooz tareeqa.
// Yeh keys ab direct code mein nahin hain.
const supabaseUrl = window.SUPABASE_URL;
const supabaseKey = window.SUPABASE_KEY;

// SECURITY WARNING: Apni keys ko client-side code mein direct daalna security ke liye acha nahi hota.
// Jab aap project live karein, to inhein Vercel ya Netlify ke environment variables mein save karein.

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
    if (!messageBar) {
        // Fallback to alert if message-bar is not found
        alert(message);
        return;
    }
    messageBar.textContent = message;
    messageBar.className = isError ? 'message-bar error' : 'message-bar success';
    messageBar.style.display = 'block';

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
    const logoutBtn = document.getElementById('logout-btn');

    if (user && userDisplay && authLinks) {
        document.getElementById('user-email').textContent = user.email;
        userDisplay.style.display = 'flex';
        authLinks.style.display = 'none';
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    } else if (userDisplay && authLinks) {
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
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
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
                <h3>${job.title ?? 'No Title'}</h3>
                <div class="job-card-company"><a href="${companyUrl}" target="_blank">${companyName}</a> - <span>${job.location ?? 'N/A'}</span></div>
                <p class="job-summary">${job.job_summary_text ?? 'No summary available.'}</p>
                <div class="job-card-footer">
                    <span class="job-type">${job.job_type ?? 'N/A'}</span>
                    <a href="${job.source_url ?? '#'}" target="_blank" class="details-btn">View Details</a>
                </div>
            </article>`;
        container.insertAdjacentHTML('beforeend', jobCardHTML);
    });
}

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
        container.innerHTML = '<h2 style="color:red;">Error loading jobs.</h2>';
    } else {
        renderJobs(data, 'Filtered Jobs');
    }
}

function renderEducation(items, title = 'Opportunities Found') {
    const container = document.querySelector('.education-listings');
    if (!container) return;
    if (!items || items.length === 0) {
        container.innerHTML = '<h2>No educational opportunities found.</h2>';
        return;
    }
    container.innerHTML = `<h2>${items.length} ${title}</h2>`;
    items.forEach(item => {
        const cardHTML = `
            <article class="edu-card">
                <h3>${item.title ?? 'No Title'}</h3>
                <div class="edu-card-institution"><strong>${item.institution ?? 'N/A'}</strong> - <span>${item.city ?? 'N/A'}</span></div>
                <p class="edu-summary">${item.summary ?? 'No summary available.'}</p>
                <div class="edu-card-footer">
                    <span>Deadline: ${new Date(item.deadline).toLocaleDateString()}</span>
                    <a href="${item.source_url ?? '#'}" target="_blank" class="details-btn">View Details</a>
                </div>
            </article>`;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

async function loadEducationByFilter() {
    const container = document.querySelector('.education-listings');
    if (!container) return;
    container.innerHTML = '<h2>Loading educational opportunities...</h2>';

    const category = document.getElementById('edu-category').value;
    const city = document.getElementById('edu-city').value;

    let query = supabase.from('education').select('*');
    if (category !== 'all') query = query.eq('category', category);
    if (city !== 'all') query = query.eq('city', city);

    const { data, error } = await query.order('deadline', { ascending: true }).limit(20);
    if (error) {
        console.error('Error fetching education data:', error);
        container.innerHTML = '<h2 style="color:red;">Error loading data.</h2>';
    } else {
        renderEducation(data, 'Filtered Opportunities');
    }
}

async function handleDeepSearch() {
    const searchTerm = document.getElementById('search-title').value.trim();
    if (!searchTerm) {
        loadJobsByFilter();
        return;
    }
    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'jobs-content';
    if (activeTab === 'jobs-content') {
        const container = document.querySelector('.job-listings');
        container.innerHTML = '<h2>Searching jobs...</h2>';
        const { data, error } = await supabase.rpc('search_jobs', { search_term: searchTerm });
        if (error) {
            container.innerHTML = '<h2 style="color:red;">Search error.</h2>';
        } else {
            renderJobs(data, 'Search Results');
        }
    } else if (activeTab === 'education-content') {
        const container = document.querySelector('.education-listings');
        container.innerHTML = '<h2>Searching education...</h2>';
        const { data, error } = await supabase.rpc('search_education', { search_term: searchTerm });
        if (error) {
            container.innerHTML = '<h2 style="color:red;">Search error.</h2>';
        } else {
            renderEducation(data, 'Search Results');
        }
    }
}


// ===== HISSA 5: UI HELPERS & EVENT LISTENERS =====

function startSlideshow() {
    const images = document.querySelectorAll('.hero-slideshow img');
    if (images.length === 0) return;
    let currentImageIndex = 0;
    setInterval(() => {
        images[currentImageIndex]?.classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex]?.classList.add('active');
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Initial Setup ---
    checkAuthState();
    startSlideshow();

    // --- Element Selection ---
    const searchInput = document.getElementById('search-title');
    const searchBtn = document.querySelector('.search-btn');
    
    const jobListingsContainer = document.querySelector('.job-listings');
    const jobTypeFilter = document.getElementById('job-type');
    const experienceFilter = document.getElementById('experience-level');

    const eduListingsContainer = document.querySelector('.education-listings');
    const eduCategoryFilter = document.getElementById('edu-category');
    const eduCityFilter = document.getElementById('edu-city');
    
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // --- Initial data load (for main page) ---
    if (jobListingsContainer) loadJobsByFilter();
    if (eduListingsContainer) loadEducationByFilter();

    // --- Event Listeners ---
    if (searchBtn) searchBtn.addEventListener('click', handleDeepSearch);
    if (searchInput) searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleDeepSearch();
    });
    
    if (jobTypeFilter) jobTypeFilter.addEventListener('change', loadJobsByFilter);
    if (experienceFilter) experienceFilter.addEventListener('change', loadJobsByFilter);

    if (eduCategoryFilter) eduCategoryFilter.addEventListener('change', loadEducationByFilter);
    if (eduCityFilter) eduCityFilter.addEventListener('change', loadEducationByFilter);

    if (signupForm) signupForm.addEventListener('submit', handleSignUp);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Tab Functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabContents.forEach(content => content.classList.remove('active'));
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const activeContent = document.getElementById(button.dataset.tab);
            if (activeContent) activeContent.classList.add('active');
        });
    });
});


