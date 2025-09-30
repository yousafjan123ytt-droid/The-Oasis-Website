// ===== Hissa 1: Supabase se Connection Qayam Karna =====

// Apni Supabase URL aur Key yahan paste karein.
const supabaseUrl = 'YOUR_SUPABASE_URL'; // https://rtmhpqbvhdshyznpilaj.supabase.co
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWhwcWJ2aGRzaHl6bnBpbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1MzEsImV4cCI6MjA3NDczMjUzMX0.S8E_l1UdWI8VaXyk0v7gMAlZdT8LMUA3a6UybRd2j40

const supabase = supabase.createClient(supabaseUrl, supabaseKey);


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

    // Pehle se mojood tamam hardcoded job cards ko saaf karein.
    jobListings.innerHTML = '<h2>Featured Jobs</h2>'; 

    jobs.forEach(job => {
        const jobCard = document.createElement('article');
        jobCard.classList.add('job-card');

        jobCard.innerHTML = `
            <div class="job-card-header">
                <h3>${job.title}</h3>
                <span class="match-score">95% Match</span>
            </div>
            <div class="job-card-company">
                <span>${job.companies? job.companies.name : 'N/A'}</span> - <span>${job.location}</span>
            </div>
            <p class="job-summary">
                ${job.job_summary_text}
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
    let currentImageIndex = 0;

    setInterval(() => {
        // Maujooda image se 'active' class hatayein
        images[currentImageIndex].classList.remove('active');

        // Agli image ka index set karein
        currentImageIndex = (currentImageIndex + 1) % images.length;

        // Agli image par 'active' class lagayein
        images[currentImageIndex].classList.add('active');
    }, 30000); // Har 30,000 milliseconds (30 seconds) mein image tabdeel karein
}


// ===== Hissa 4: Tamam Functions Ko Chalana =====

// Jab poora page load ho jaye, to yeh dono functions chalayein
document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    startSlideshow();
});