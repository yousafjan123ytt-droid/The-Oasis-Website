// ===== HISSA 1: SUPABASE SE CONNECTION QAYAM KARNA =====

const supabaseUrl = 'YOUR_SUPABASE_URL';      // 'https://rtmhpqbvhdshyznpilaj.supabase.co   '; 
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWhwcWJ2aGRzaHl6bnBpbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1MzEsImV4cCI6MjA3NDczMjUzMX0.S8E_l1UdWI8VaXyk0v7gMAlZdT8LMUA3a6UybRd2j40 '; 




// Sahi Tareeqa: supabase library se createClient function hasil karein
// Galti Yahan Thi: 'supabase.createClient' galat tha
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey); // Humne variable ka naam change kiya hai


// ===== HISSA 2: SEARCH AUR FILTERS KE BUTTONS HASIL KARNA =====

const searchBtn = document.querySelector('.search-btn');
const searchTitleInput = document.getElementById('search-title');
const searchLocationInput = document.getElementById('search-location');
const jobTypeFilter = document.getElementById('job-type');
// Baaqi filters ko bhi aap yahan add kar sakte hain


// ===== HISSA 3: DATABASE SE JOBS FETCH KARNA (SMART VERSION) =====

async function loadJobs(filters = {}) {
    const jobListings = document.querySelector('.job-listings');
    jobListings.innerHTML = '<h2>Searching for opportunities...</h2>';

    // Supabase query ko banana shuru karein
    // Hum 'supabaseClient' istemal kar rahay hain
    let query = supabaseClient
        .from('jobs')
        .select(`*, companies(name)`);

    // Search term ke liye query mein izafa karein
    if (filters.title) {
        query = query.ilike('title', `%${filters.title}%`);
    }
    if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
    }

    // Filters ke liye query mein izafa karein
    if (filters.jobType && filters.jobType !== 'all') {
        query = query.eq('job_type', filters.jobType);
    }

    // Query ko database par bhejein aur data hasil karein
    const { data: jobs, error } = await query;

    if (error) {
        console.error('Error fetching jobs:', error);
        jobListings.innerHTML = '<h2>Error loading jobs. Please try again.</h2>';
        return;
    }

    if (jobs.length === 0) {
        jobListings.innerHTML = '<h2>No matching opportunities found.</h2>';
        return;
    }

    jobListings.innerHTML = '<h2>Search Results</h2>';

    jobs.forEach(job => {
        const jobCard = document.createElement('article');
        jobCard.classList.add('job-card');

        const companyName = job.companies ? job.companies.name : 'N/A';
        
        // Sahi Tareeqa: || (OR operator) istemal karein
        // Galti Yahan Thi: | | galat tha
        const summary = job.job_summary_text || 'No summary available.';

        jobCard.innerHTML = `
            <div class="job-card-header">
                <h3>${job.title}</h3>
                <span class="match-score">95% Match</span>
            </div>
            <div class="job-card-company">
                <span>${companyName}</span> - <span>${job.location}</span>
            </div>
            <p class="job-summary">
                ${summary}
            </p>
            <div class="job-card-footer">
                <span class="job-type">${job.job_type}</span>
                <a href="${job.source_url}" target="_blank" class="details-btn">View Details</a>
            </div>
        `;
        jobListings.appendChild(jobCard);
    });
}


// ===== HISSA 4: TAMAM FUNCTIONS KO ZINDA KARNA =====

document.addEventListener('DOMContentLoaded', () => {
    // Shuruaat mein tamam jobs load karein
    loadJobs();

    // Search button par click hone ka intezar karein
    if(searchBtn) { // Safety check
        searchBtn.addEventListener('click', () => {
            const filters = {
                title: searchTitleInput.value,
                location: searchLocationInput.value,
                jobType: jobTypeFilter.value,
            };
            loadJobs(filters);
        });
    }

    // Yahan aap apne startSlideshow() aur setupFilterTabs() functions ko call kar sakte hain
    // agar woh mojood hain.
});