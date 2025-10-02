// ===== HISSA 1: SUPABASE SE CONNECTION QAYAM KARNA =====


const supabaseUrl = 'YOUR_SUPABASE_URL';      //https://rtmhpqbvhdshyznpilaj.supabase.co

const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWhwcWJ2aGRzaHl6bnBpbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1MzEsImV4cCI6MjA3NDczMjUzMX0.S8E_l1UdWI8VaXyk0v7gMAlZdT8LMUA3a6UybRd2j40


const { createClient } = supabase;

const supabaseClient = createClient(supabaseUrl, supabaseKey);



// ===== HISSA 2: TAMAM HTML ELEMENTS HASIL KARNA =====


const searchBtn = document.querySelector('.search-btn');

const searchTitleInput = document.getElementById('search-title');

const searchLocationInput = document.getElementById('search-location');

const jobTypeFilter = document.getElementById('job-type');

// Aap experience-level aur baaqi filters ko bhi yahan la sakte hain



// ===== HISSA 3: DATABASE SE JOBS FETCH KARNA (SMART VERSION) =====


async function loadJobs(filters = {}) {

    const jobListings = document.querySelector('.job-listings');

    if (!jobListings) return; // Agar element na ho to function rok dein

    jobListings.innerHTML = '<h2><i class="fas fa-spinner fa-spin"></i> Searching for opportunities...</h2>';


    let query = supabaseClient.from('jobs').select(`*, companies(name)`);


    // Search filters

    if (filters.title) {

        query = query.ilike('title', `%${filters.title}%`);

    }

    if (filters.location) {

        query = query.ilike('location', `%${filters.location}%`);

    }


    // Dropdown filters

    if (filters.jobType && filters.jobType !== 'all') {

        query = query.eq('job_type', filters.jobType);

    }

    // Aap yahan experience level ka filter bhi add kar sakte hain


    const { data: jobs, error } = await query;


    if (error) {

        console.error('Error fetching jobs:', error);

        jobListings.innerHTML = '<h2><i class="fas fa-exclamation-circle"></i> Error loading jobs. Please try again.</h2>';

        return;

    }


    if (jobs.length === 0) {

        jobListings.innerHTML = '<h2>No matching opportunities found.</h2>';

        return;

    }


    jobListings.innerHTML = ''; // Purane results saaf karein


    jobs.forEach(job => {

        const jobCard = document.createElement('article');

        jobCard.classList.add('job-card');


        const companyName = job.companies ? job.companies.name : 'N/A';

        const summary = job.job_summary_text || 'No summary available.';


        jobCard.innerHTML = `

            <div class="job-card-header">

                <h3>${job.title}</h3>

                <span class="match-score">95% Match</span>

            </div>

            <div class="job-card-company">

                <span>${companyName}</span> - <span>${job.location}</span>

            </div>

            <p class="job-summary">${summary}</p>

            <div class="job-card-footer">

                <span class="job-type">${job.job_type}</span>

                <a href="${job.source_url}" target="_blank" class="details-btn">View Details</a>

            </div>

        `;

        jobListings.appendChild(jobCard);

    });

}


// ===== HISSA 4: SLIDESHOW AUR FILTER TABS (YEH HISSA MISSING THA) =====


function startSlideshow() {

    const images = document.querySelectorAll('.hero-slideshow img');

    if (images.length === 0) return;

    let currentImageIndex = 0;

    images[currentImageIndex].classList.add('active');


    setInterval(() => {

        images[currentImageIndex].classList.remove('active');

        currentImageIndex = (currentImageIndex + 1) % images.length;

        images[currentImageIndex].classList.add('active');

    }, 5000); // Har 5 second baad image badle

}


function setupFilterTabs() {

    const tabButtons = document.querySelectorAll('.tab-btn');

    const filterSections = document.querySelectorAll('.filter-section');


    tabButtons.forEach(button => {

        button.addEventListener('click', () => {

            tabButtons.forEach(btn => btn.classList.remove('active'));

            filterSections.forEach(sec => sec.classList.remove('active'));


            button.classList.add('active');

            const filterId = button.dataset.filter + '-filters';

            const filterToShow = document.getElementById(filterId);

            

            if (filterToShow) {

                filterToShow.classList.add('active');

            }

        });

    });

}



// ===== HISSA 5: TAMAM FUNCTIONS KO ZINDA KARNA =====



    // Shuruaat mein tamam jobs load karein

    loadJobs();

    

    // YEH LINES MISSING THEEN

    startSlideshow();      // Slideshow shuru karein

    setupFilterTabs();     // Taleem/KaamKaj ke tabs ko chalu karein


    // Search button par click hone ka intezar karein

    if (searchBtn) {

        searchBtn.addEventListener('click', () => {

            const filters = {

                title: searchTitleInput.value,

                location: searchLocationInput.value,

                jobType: jobTypeFilter.value,

            };

            loadJobs(filters);

        });

    }


    // Filter dropdowns ke change hone par bhi search chalayein

    if (jobTypeFilter) {

        jobTypeFilter.addEventListener('change', () => {

            searchBtn.click(); // Sirf search button ko dobara click kar dein

        });

    }

});