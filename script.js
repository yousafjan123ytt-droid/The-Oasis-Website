// ===== Hissa 1: Supabase se Connection Qayam Karna =====

const supabaseUrl = 'YOUR_SUPABASE_URL'; // https://rtmhpqbvhdshyznpilaj.supabase.co 
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; //  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWhwcWJ2aGRzaHl6bnBpbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1MzEsImV4cCI6MjA3NDczMjUzMX0.S8E_l1UdWI8VaXyk0v7gMAlZdT8LMUA3a6UybRd2j40

// -- SAHI TAREEQA --
const { createClient } = window.supabase;
const supabase = createClient(supabaseUrl, supabaseKey);


// ===== Hissa 2: Database se Jobs Fetch Karna aur Dikhana =====

async function loadJobs() {
    const jobListings = document.querySelector('.job-listings');
    if (!jobListings) return;

    const { data: jobs, error } = await supabase
        .from('jobs')
        .select(`*, companies ( id, name )`);

    if (error) {
        console.error('Error fetching jobs:', error);
        return;
    }

    jobListings.innerHTML = '<h2>Featured Opportunities</h2>';

    jobs.forEach(job => {
        const jobCard = document.createElement('article');
        jobCard.classList.add('job-card');

        const companyName = job.companies ? job.companies.name : 'N/A';
        const companyLink = `<a href="#">${companyName}</a>`;

        jobCard.innerHTML = `
            <div class="job-card-header">
                <h3>${job.title}</h3>
                <span class="match-score">95% Match</span>
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

// ===== Hissa 3: Background Image Slideshow Ka Jadoo =====
function startSlideshow() {
    const images = document.querySelectorAll('.hero-slideshow img');
    if (images.length === 0) return;
    
    let currentImageIndex = 0;
    images[currentImageIndex].classList.add('active');

    setInterval(() => {
        images[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].classList.add('active');
    }, 5000);
}

// ===== NAYA HISSA 4: Filter Tabs Ka Jadoo =====
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

// ===== Hissa 5: Tamam Functions Ko Chalana =====
document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    startSlideshow();
    setupFilterTabs();
});