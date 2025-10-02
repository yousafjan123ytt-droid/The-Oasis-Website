// ===== HISSA 1: SETUP AUR CONFIGURATION =====

// AHEM NOTE: Browser mein hamesha 'anon' key istemal karein, 'service_role' key nahi.
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; //  https://rtmhpqbvhdshyznpilaj.supabase.co      
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY'; // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWhwcWJ2aGRzaHl6bnBpbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1MzEsImV4cCI6MjA3NDczMjUzMX0.S8E_l1UdWI8VaXyk0v7gMAlZdT8LMUA3a6UybRd2j40

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// HTML elements ko select karna
const jobListingsContainer = document.querySelector('.job-listings');
const searchButton = document.querySelector('.search-btn');
const titleInput = document.querySelector('#search-title');
const locationInput = document.querySelector('#search-location');
const jobTypeFilter = document.querySelector('#job-type');
const experienceFilter = document.querySelector('#experience-level');


// ===== HISSA 2: JOBS KO LOAD AUR FILTER KARNE WALA ENGINE =====

async function loadAndDisplayJobs() {
    console.log('Fetching jobs...');
    jobListingsContainer.innerHTML = '<h2>Loading Opportunities...</h2>';

    // Query banana shuru karein
    let query = supabase.from('jobs').select(`*, companies (name)`);

    // 1. Search Bar se filter lagana
    const searchTerm = titleInput.value.trim();
    if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
    }
    const searchLocation = locationInput.value.trim();
    if (searchLocation) {
        query = query.ilike('location', `%${searchLocation}%`);
    }

    // 2. Dropdown filters se filter lagana
    if (jobTypeFilter.value !== 'all') {
        query = query.eq('job_type', jobTypeFilter.value);
    }
    if (experienceFilter.value !== 'all') {
        // Iske liye database mein 'experience_level' ka column hona zaroori hai
        // query = query.eq('experience_level', experienceFilter.value);
    }
    
    // Query ko execute karna
    const { data: jobs, error } = await query;

    if (error) {
        console.error('Error fetching jobs:', error);
        jobListingsContainer.innerHTML = '<p>Error loading jobs. Please try again.</p>';
        return;
    }

    // Naye results ke liye container ko saaf karna
    jobListingsContainer.innerHTML = '<h2>Featured Opportunities</h2>';

    if (jobs.length === 0) {
        jobListingsContainer.innerHTML += '<p>No matching jobs found. Try different filters.</p>';
        return;
    }
    
    // Har job ke liye ek naya card banana
    jobs.forEach(job => {
        const jobCard = document.createElement('article');
        jobCard.classList.add('job-card');
        const companyName = job.companies ? job.companies.name : 'N/A';

        jobCard.innerHTML = `
            <div class="job-card-header">
                <h3>${job.title || 'N/A'}</h3>
            </div>
            <div class="job-card-company">
                <span>${companyName}</span> - <span>${job.location || 'N/A'}</span>
            </div>
            <p class="job-summary">
                ${job.job_summary_text || 'No summary available.'}
            </p>
            <div class="job-card-footer">
                <span class="job-type">${job.job_type || 'N/A'}</span>
                <a href="${job.source_url}" target="_blank" class="details-btn">View Details</a>
            </div>
        `;
        jobListingsContainer.appendChild(jobCard);
    });
}


// ===== HISSA 3: WEBSITE KO INTERACTIVE BANANA =====

// Jab poora page load ho jaye, to yeh kaam shuru karein
document.addEventListener('DOMContentLoaded', () => {
    // 1. Shuruwat mein tamam jobs load karein
    loadAndDisplayJobs();

    // 2. Search button par click karne se filter shuda jobs load karein
    searchButton.addEventListener('click', loadAndDisplayJobs);

    // 3. Har filter ke tabdeel honay par filter shuda jobs load karein
    jobTypeFilter.addEventListener('change', loadAndDisplayJobs);
    experienceFilter.addEventListener('change', loadAndDisplayJobs);
});

// Login/Sign Up ka function yahan aayega (aglay step mein)
// async function handleSignUp(email, password) { ... }
// async function handleLogin(email, password) { ... }