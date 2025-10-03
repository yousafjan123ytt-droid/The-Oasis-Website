// Supabase Connection
const supabaseUrl = '  https://rtmhpqbvhdshyznpilaj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWhwcWJ2aGRzaHl6bnBpbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1MzEsImV4cCI6MjA3NDczMjUzMX0.S8E_l1UdWI8VaXyk0v7gMAlZdT8LMUA3a6UybRd2j40 ';
const { createClient } = window.supabase;
const supabase = createClient(supabaseUrl, supabaseKey);

// DOM Elements
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

// Sign Up Logic
if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            alert('Error signing up: ' + error.message);
        } else {
            alert('Signup successful! Please check your email for a confirmation link.');
        }
    });
}

// Login Logic
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert('Error logging in: ' + error.message);
        } else {
            // Login kamyab hone par user ko homepage par bhej dein
            window.location.href = 'index.html';
        }
    });
}