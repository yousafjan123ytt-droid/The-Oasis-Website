// ===== SUPABASE CLIENT SETUP =====
// Aapki URL aur Key ab is code mein sahi se daal di gayi hain.
const SUPABASE_URL = 'https://rtmhpqbvhdshyznpilaj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWhwcWJ2aGRzaHl6bnBpbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1MzEsImV4cCI6MjA3NDczMjUzMX0.S8E_l1UdWI8VaXyk0v7gMAlZdT8LMUA3a6UybRd2j40';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== SIGN UP LOGIC =====
const signupForm = document.querySelector('#signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Form ko page refresh karne se rokein

        // Form se user ka data hasil karein
        const email = signupForm['email'].value;
        const password = signupForm['password'].value;
        const confirmPassword = signupForm['confirm-password'].value;

        // Check karein ke dono password aapas mein milte hain ya nahi
        if (password !== confirmPassword) {
            alert("Passwords match nahi ho rahe. Dobara koshish karein.");
            return; // Agar password match na ho to aagay na barhein
        }

        // Supabase ko user register karne ki request bhejein
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            // Agar koi ghalti ho to user ko batayein
            alert('Sign up mein ghalti hui: ' + error.message);
        } else {
            // Agar account ban jaye to user ko khushkhabri dein
            alert('Aapka account kamyabi se ban gaya! Apne email par ja kar account verify karein, phir login karein.');
            // User ko login page par bhej dein
            window.location.href = 'login.html';
        }
    });
}

// ===== LOGIN LOGIC =====
const loginForm = document.querySelector('#login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Form ko page refresh karne se rokein

        // Form se user ka data hasil karein
        const email = loginForm['email'].value;
        const password = loginForm['password'].value;

        // Supabase ko user login karne ki request bhejein
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            // Agar ghalat email/password ho to user ko batayein
            alert('Login mein ghalti hui: ' + error.message);
        } else {
            // Agar login kamyab ho to user ko homepage par bhej dein
            window.location.href = 'index.html';
        }
    });
}

