// ===== HISSA 1: SUPABASE CONNECTION =====
const supabaseUrl = 'https://rtmhpqbvhdshyznpilaj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bWhwcWJ2aGRzaHl6bnBpbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1MzEsImV4cCI6MjA3NDczMjUzMX0.S8E_l1UdWI8VaXyk0v7gMAlZdT8LMUA3a6UybRd2j40';

const { createClient } = window.supabase;
const supabase = createClient(supabaseUrl, supabaseKey);

// ===== HISSA 2: ELEMENTS =====
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

// ===== HISSA 3: AUTH LOGIC =====

// Sign Up Logic
if (signupForm) {
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const submitBtn = signupForm.querySelector("button");

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Creating Account...";

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Supabase Signup Error:", error);
      alert("Signup failed: " + error.message);
    } else {
      alert("Signup successful! Please check your email to verify.");
      window.location.href = "login.html";
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
  });
}

// Login Logic
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login Error:", error);
      alert('Error logging in: ' + error.message);
    } else {
      window.location.href = 'index.html'; // Redirect after login
    }
  });
}