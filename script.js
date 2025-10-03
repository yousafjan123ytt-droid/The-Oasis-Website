// ===== HISSA 1: SUPABASE CONNECTION =====
const supabaseUrl = 'https://rtmhpqbvhdshyznpilaj.supabase.co ';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWhwcWJ2aGRzaHl6bnBpbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1MzEsImV4cCI6MjA3NDczMjUzMX0.S8E_l1UdWI8VaXyk0v7gMAlZdT8LMUA3a6UybRd2j40 ';

const { createClient } = window.supabase;
const db = createClient(supabaseUrl, supabaseKey);


// ===== HISSA 2: ELEMENTS =====
const searchBtn = document.querySelector('.search-btn');
const searchTitleInput = document.getElementById('search-title') || { value: '' };
const searchLocationInput = document.getElementById('search-location') || { value: '' };

const jobTypeFilter = document.getElementById('job-type') || { value: 'all' };
const experienceFilter = document.getElementById('experience-level') || { value: 'all' };
const salaryFilter = document.getElementById('salary-range') || { value: '0' };
const salaryValue = document.getElementById('salary-value');


// ===== HISSA 3: JOBS LOAD FUNCTION (WITH DEEP SEARCH) =====
async function loadJobs(filters = {}) {
    const jobListings = document.querySelector('.job-listings');
    jobListings.innerHTML = '<div class="loader">Loading jobs...</div>'; // loader

    let query = db
        .from('jobs')
        .select(`
            *,
            companies ( id, name, website_url )
        `);

    // Deep search across title + summary + location
    if (filters.title) {
        query = query.or(
            `title.ilike.%${filters.title}%,job_summary_text.ilike.%${filters.title}%,location.ilike.%${filters.title}%`
        );
    }

    if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.jobType && filters.jobType !== 'all') {
        query = query.eq('job_type', filters.jobType);
    }

    if (filters.experience && filters.experience !== 'all') {
        query = query.eq('experience_level', filters.experience);
    }

    if (filters.salary && filters.salary !== '0') {
        query = query.lte('salary', filters.salary);
    }

    const { data: jobs, error } = await query;

    if (error) {
        console.error('Error fetching jobs:', error);
        jobListings.innerHTML = '<h2 style="color:red;">Error loading jobs. Please try again.</h2>';
        return;
    }

    if (!jobs || jobs.length === 0) {
        jobListings.innerHTML = '<h2>No jobs found. Try different filters.</h2>';
        return;
    }

    jobListings.innerHTML = `<h2>${jobs.length} Jobs Found</h2>`;

    jobs.forEach(job => {
        const jobCard = document.createElement('article');
        jobCard.classList.add('job-card');

        const companyName = job.companies?.[0]?.name || job.companies?.name || 'N/A';
        const companyUrl = job.companies?.[0]?.website_url || job.companies?.website_url || '#';
        const companyLink = `<a href="${companyUrl}" target="_blank">${companyName}</a>`;

        // Dynamic Match Score (basic logic: more filters matched → higher score)
        let score = 50;
        if (filters.title && job.title?.toLowerCase().includes(filters.title.toLowerCase())) score += 20;
        if (filters.location && job.location?.toLowerCase().includes(filters.location.toLowerCase())) score += 15;
        if (filters.jobType && filters.jobType === job.job_type) score += 15;

        jobCard.innerHTML = `
            <div class="job-card-header">
                <h3>${job.title}</h3>
                <span class="match-score">${score}% Match</span>
            </div>
            <div class="job-card-company">
                <span>${companyLink}</span> - <span>${job.location}</span>
            </div>
            <p class="job-summary">
                ${job.job_summary_text || 'No summary available.'}
            </p>
            <div class="job-card-footer">
                <span class="job-type">${job.job_type}</span>
                <a href="${job.source_url}" target="_blank" class="details-btn">View Details</a>
            </div>
        `;
        jobListings.appendChild(jobCard);
    });
}


// ===== HISSA 4: EVENTS =====
document.addEventListener('DOMContentLoaded', () => {
    loadJobs();

    startSlideshow();
    setupFilterTabs();

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const filters = {
                title: searchTitleInput.value,
                location: searchLocationInput.value,
                jobType: jobTypeFilter.value,
                experience: experienceFilter.value,
                salary: salaryFilter.value
            };
            loadJobs(filters);
        });
    }

    // Enter key search support
    [searchTitleInput, searchLocationInput].forEach(input => {
        if (input && input.addEventListener) {
            input.addEventListener('keypress', e => {
                if (e.key === 'Enter') searchBtn.click();
            });
        }
    });

    if (salaryFilter && salaryValue) {
        salaryFilter.addEventListener('input', () => {
            salaryValue.textContent =
                salaryFilter.value === '0'
                    ? 'Any Salary'
                    : `Up to PKR ${parseInt(salaryFilter.value).toLocaleString()}`;
        });
    }
});


// ===== HISSA 5: SLIDESHOW & TABS =====
function startSlideshow() {
    const images = document.querySelectorAll('.hero-slideshow img');
    if (images.length === 0) return;
    let currentImageIndex = 0;
    setInterval(() => {
        images[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].classList.add('active');
    }, 10000);
}

function setupFilterTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const filterSections = document.querySelectorAll('.filter-section');
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