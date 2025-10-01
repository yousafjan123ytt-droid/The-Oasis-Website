// ===== Hissa 1: Supabase se Connection Qayam Karna =====

// Apni Supabase URL aur Key yahan paste karein.
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Yahan apni URL paste karein
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Yahan apni anon key paste karein

// -- SAHI TAREEQA --
const { createClient } = window.supabase;
const supabase = createClient(supabaseUrl, supabaseKey);


// ===== Hissa 2: Database se Jobs Fetch Karna aur Dikhana =====

async function loadJobs() {
    const jobListings = document.querySelector('.job-listings');

    const { data: jobs, error } = await supabase
     .from('jobs')
     .select(`
            *,
            companies ( name, logo_url )
        `);

    if (error) {
        console.error('Error fetching jobs:', error);
        return;
    }

    jobListings.innerHTML = '<h2>Featured Jobs</h2>'; 

    jobs.forEach(job => {
        const jobCard = document.createElement('article');
        jobCard.classList.add('job-card');

        const companyName = job.companies ? job.companies.name : 'N/A';
        const companyLink = `<a href="#">${companyName}</a>`; // Placeholder link

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

// ===== NAYA HISSA 3: Background Image Slideshow Ka Jadoo =====

function startSlideshow() {
    const images = document.querySelectorAll('.hero-slideshow img');
    if (images.length === 0) return; 
    
    let currentImageIndex = 0;
    images[currentImageIndex].classList.add('active'); // Pehli image ko foran dikhana

    setInterval(() => {
        images[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].classList.add('active');
    }, 5000); // Har 5 seconds mein image tabdeel karein
}


// ===== Hissa 4: Tamam Functions Ko Chalana =====

document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    startSlideshow();
});