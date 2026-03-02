/* UI Interactions - Velvet Bakes */
function initUI() {
    // Mobile Navigation logic could go here
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky Header Scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(26, 14, 9, 0.98)';
        } else {
            header.style.padding = '20px 0';
            header.style.background = 'rgba(26, 14, 9, 0.95)';
        }
    });

    // Countdown for Cake of the Week (Mockup)
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        let timeLeft = 172800; // 48 hours in seconds
        setInterval(() => {
            if (timeLeft <= 0) return;
            timeLeft--;
            const hours = Math.floor(timeLeft / 3600);
            const mins = Math.floor((timeLeft % 3600) / 60);
            const secs = timeLeft % 60;
            countdownElement.innerText = `${hours}h ${mins}m ${secs}s`;
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', initUI);
