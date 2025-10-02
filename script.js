// ===== HISSA 1: SETUP AUR CONFIGURATION =====

// Apni Supabase URL aur ANON key yahan quotes ke andar paste karein.
const supabaseUrl = ' https://rtmhpqbvhdshyznpilaj.supabase.co';
const supabaseKey = ' eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWhwcWJ2aGRzaHl6bnBpbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1MzEsImV4cCI6MjA3NDczMjUzMX0.S8E_l1UdWI8VaXyk0v7gMAlZdT8LMUA3a6UybRd2j40';

const { createClient } = window.supabase;
const supabase = createClient(supabaseUrl, supabaseKey);

// HTML se tamam zaroori elements ko JavaScript mein lana
const jobListingsContainer = document.querySelector('.job-listings');
const searchButton = document.querySelector('.search-btn');
const titleInput = document.getElementById('search-title');
const locationInput = document.getElementById('search-location');
const jobTypeFilter = document.getElementById('job-type');
const experienceFilter = document.getElementById('experience-level');
const salaryFilter = document.getElementById('salary-range');
const salaryValueSpan = document.getElementById('salary-value');
const tabButtons = document.querySelectorAll('.tab-btn');
const filterSections = document.querySelectorAll('.filter-section');
const slideshowImages = document.querySelectorAll('.hero-slideshow img');


// ===== HISSA 2: CORE FUNCTIONS (ASAL ENGINE) =====

// Function: Database se jobs fetch karna aur dikhana
async function loadJobs() {
    console.log('Fetching jobs...');
    jobListingsContainer.innerHTML = '<h2>Searching for opportunities...</h2>';

    let query = supabase.from('jobs').select(`*, companies (id, name)`);

    // Filters lagana
    const searchTerm = titleInput.value.trim();
    if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
    }
    if (jobTypeFilter.value !== 'all') {
        query = query.eq('job_type', jobTypeFilter.value);
    }

    const { data: jobs, error } = await query;

    if (error) {
        console.error('Error fetching jobs:', error);
        jobListingsContainer.innerHTML = '<h2>Error loading jobs.</h2>';
        return;
    }

    jobListingsContainer.innerHTML = '<h2>Featured Opportunities</h2>';

    if (jobs.length === 0) {
        jobListingsContainer.innerHTML += '<p>No matching opportunities found.</p>';
        return;
    }

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

// Function: Background slideshow chalana
function startSlideshow() {
    if (slideshowImages.length === 0) return;
    let currentImageIndex = 0;
    slideshowImages[currentImageIndex].classList.add('active');

    setInterval(() => {
        slideshowImages[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
        slideshowImages[currentImageIndex].classList.add('active');
    }, 5000);
}

// Function: Filter tabs ki functionality set karna
function setupFilterTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            filterSections.forEach(sec => sec.classList.remove('active'));
            button.classList.add('active');
            const filterToShow = document.getElementById(button.dataset.filter + '-filters');
            if (filterToShow) {
                filterToShow.classList.add('active');
            }
        });
    });
}


// ===== HISSA 3: WEBSITE KO ZINDA KARNA (EVENT LISTENERS) =====

// Jab poora page load ho jaye, to tamam functions ko shuru karein
document.addEventListener('DOMContentLoaded', () => {
    // Shuruaat mein tamam jobs load karein
    loadJobs();
    
    // Background slideshow shuru karein
    startSlideshow();
    
    // Filter tabs ka jadoo chalayein
    setupFilterTabs();

    // Search button par click karne ka intezar karein
    searchButton.addEventListener('click', loadJobs);

    // Dropdown filters ke tabdeel honay par jobs dobara load karein
    jobType-filter.addEventListener('change', loadJobs);
    experienceFilter.addEventListener('change', loadJobs);

    // Salary slider ki value ko update karein
    if (salaryFilter && salaryValueSpan) {
        salaryFilter.addEventListener('input', () => {
            if (salaryFilter.value === '0') {
                salaryValueSpan.textContent = 'Any Salary';
            } else {
                salaryValueSpan.textContent = `Up to PKR ${parseInt(salaryFilter.value).toLocaleString()}`;
            }
        });
    }
});