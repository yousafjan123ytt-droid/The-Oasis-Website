// ===== Hissa 1: Supabase se Connection Qayam Karna =====
const supabaseUrl = 'https://rtmhpqbvhdshyznpilaj.supabase.co  '; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWhwcWJ2aGRzaHl6bnBpbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1MzEsImV4cCI6MjA3NDczMjUzMX0.S8E_l1UdWI8VaXyk0v7gMAlZdT8LMUA3a6UybRd2j40 '; 

const { createClient } = window.supabase;
const supabase = createClient(supabaseUrl, supabaseKey);

// ===== Hissa 2: Database se Jobs Fetch Karna aur Dikhana =====
async function loadJobs() {
    const jobListings = document.querySelector('.job-listings');
    if (!jobListings) return;

    const { data: jobs, error } = await supabase
        .from('jobs')
        .select(`*, companies(name)`);

    if (error) {
        console.error('Error fetching jobs:', error);
        jobListings.innerHTML = '<p>Error loading jobs. Please try again later.</p>';
        return;
    }

    jobListings.innerHTML = '<h2>Featured Opportunities</h2>';

    if (jobs.length === 0) {
        jobListings.innerHTML += '<p>No jobs found at the moment. Please check back later.</p>';
        return;
    }

    jobs.forEach(job => {
        const jobCard = document.createElement('article');
        jobCard.classList.add('job-card');

        const companyName = job.companies ? job.companies.name : 'N/A';

        jobCard.innerHTML = `
            <div class="job-card-header">
                <h3>${job.title || 'No Title'}</h3>
                <span class="match-score">95% Match</span>
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
        jobListings.appendChild(jobCard);
    });
}

// ===== Hissa 3: Background Image Slideshow =====
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

// ===== NAYA HISSA 4: Filter Tabs Ka Jadoo (SAHI LOGIC KE SATH) =====
function setupFilterTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const filterSections = document.querySelectorAll('.filter-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all buttons and sections
            tabButtons.forEach(btn => btn.classList.remove('active'));
            filterSections.forEach(sec => sec.classList.remove('active'));

            // Add 'active' class to the clicked button
            button.classList.add('active');

            // Show the corresponding filter section using the 'data-filter' attribute
            const filterId = button.dataset.filter + '-filters'; // e.g., 'jobs-filters'
            const filterToShow = document.getElementById(filterId);
            
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
    setupFilterTabs(); // Filter tabs ki functionality ko activate karna
});