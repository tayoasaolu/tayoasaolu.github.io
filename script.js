// ============ Global Variables ============
let projects = [];
let currentFilter = 'all';

// ============ DOM Content Loaded ============
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initializeNavigation();
    initializeProjects();
    initializeScrollEffects();
    initializeForm();
    initializeCollapsibles();
    initializeTheme();
    
    // Hide loading overlay after initialization
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }, 500);
});

// ============ Navigation Functions ============
function initializeNavigation() {
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const navLinks = document.getElementById('navLinks');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(event.target) && !mobileToggle.contains(event.target)) {
                closeMobileMenu();
            }
        }
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (navLinks && toggle) {
        navLinks.classList.toggle('active');
        toggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }
}

function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (navLinks && toggle) {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============ Project Functions ============
async function initializeProjects() {
    try {
        // Load projects from JSON file
        const response = await fetch('./data/projects.json');
        if (!response.ok) {
            throw new Error('Failed to load projects');
        }
        
        projects = await response.json();
        displayProjects('all');
    } catch (error) {
        console.error('Error loading projects:', error);
        // Display fallback projects if JSON fails to load
        displayFallbackProjects();
    }
}

function displayProjects(filter = 'all') {
    const container = document.getElementById('project-container');
    if (!container) return;
    
    // Filter projects
    const filteredProjects = filter === 'all' 
        ? projects 
        : projects.filter(project => project.category === filter);
    
    // Clear container
    container.innerHTML = '';
    
    // Display filtered projects
    filteredProjects.forEach((project, index) => {
        const projectCard = createProjectCard(project);
        container.appendChild(projectCard);
        
        // Add animation
        setTimeout(() => {
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Update current filter
    currentFilter = filter;
}

function createProjectCard(project) {
    const article = document.createElement('article');
    article.className = 'project';
    article.style.opacity = '0';
    article.style.transform = 'translateY(20px)';
    article.style.transition = 'all 0.3s ease';
    
    article.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-meta">
            <span class="project-category">${project.category}</span>
            <span class="project-date">${project.date || ''}</span>
        </div>
        ${project.technologies ? `
            <div class="project-tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        ` : ''}
        ${project.link ? `
            <a href="${project.link}" target="_blank" rel="noopener" class="project-link">
                View Project →
            </a>
        ` : ''}
    `;
    
    return article;
}

function displayFallbackProjects() {
    // Fallback projects if JSON fails to load
    projects = [
        {
            title: "Customer Retention Analytics Dashboard",
            description: "Built an interactive Power BI dashboard analyzing customer behavior patterns and predicting churn with 90% accuracy.",
            category: "dashboard",
            technologies: ["Power BI", "SQL", "Python"],
            date: "2024",
            link: "#"
        },
        {
            title: "Sales Performance Automation",
            description: "Automated daily sales reporting pipeline reducing processing time from 7 days to under 5 minutes.",
            category: "automation",
            technologies: ["Python", "SQL", "Azure"],
            date: "2024",
            link: "#"
        },
        {
            title: "Inventory Optimization Model",
            description: "Developed predictive model for inventory management, reducing stockouts by 35% and overstock by 25%.",
            category: "analysis",
            technologies: ["R", "Python", "Tableau"],
            date: "2023",
            link: "#"
        },
        {
            title: "Real-time KPI Monitoring System",
            description: "Implemented organization-wide KPI tracking system with live dashboards for executive decision-making.",
            category: "dashboard",
            technologies: ["Power BI", "SQL", "DAX"],
            date: "2023",
            link: "#"
        }
    ];
    
    displayProjects('all');
}

// Project filtering
function filterProjects(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Display filtered projects
    displayProjects(category);
}

// ============ Scroll Effects ============
function initializeScrollEffects() {
    const backToTopBtn = document.getElementById('backToTop');
    
    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        // Add navbar shadow on scroll
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = 'var(--shadow-md)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        }
    });
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============ Form Functions ============
function initializeForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // If using Formspree or similar service
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    showNotification('Thank you for your message! I will get back to you soon.', 'success');
                    this.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                // Error
                console.error('Form submission error:', error);
                showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// ============ Collapsible Sections ============
function initializeCollapsibles() {
    // Initialize any existing collapsibles
    document.querySelectorAll('.toggle').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('onclick')?.match(/toggleSectionKATEX_INLINE_OPEN'(.+)'KATEX_INLINE_CLOSE/)?.[1];
            if (targetId) {
                toggleSection(targetId);
            }
        });
    });
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const toggle = document.querySelector(`[onclick="toggleSection('${sectionId}')"]`);
    
    if (section && toggle) {
        const isVisible = section.style.display === 'block';
        
        // Toggle section
        section.style.display = isVisible ? 'none' : 'block';
        
        // Update toggle button
        toggle.classList.toggle('active', !isVisible);
        
        // Smooth animation
        if (!isVisible) {
            section.style.opacity = '0';
            setTimeout(() => {
                section.style.opacity = '1';
            }, 10);
        }
    }
}

// ============ Theme Functions ============
function initializeTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update theme button icon
    const themeBtn = document.querySelector('.toggle-theme');
    if (themeBtn) {
        themeBtn.textContent = isDark ? '☀️' : '🌓';
    }
}

// ============ Utility Functions ============
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ============ Intersection Observer for Animations ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('section, .card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
});

// ============ CSS for Animations ============
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.6s ease;
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: 1rem;
    }
    
    .project-meta {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        font-size: 0.875rem;
        color: var(--clr-muted);
    }
    
    .project-tech {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .tech-tag {
        padding: 0.25rem 0.75rem;
        background: var(--clr-accent-light);
        color: var(--clr-accent);
        border-radius: 15px;
        font-size: 0.75rem;
        font-weight: 500;
    }
    
    .project-link {
        display: inline-block;
        margin-top: 1rem;
        color: var(--clr-accent);
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s ease;
    }
    
    .project-link:hover {
        transform: translateX(5px);
    }
`;
document.head.appendChild(style);

// ============ Performance Optimization ============
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll event listeners
window.addEventListener('scroll', debounce(() => {
    // Your scroll event code here
}, 100));


// ============ Additional Functions - Enhanced JavaScript ============
// Mobile Menu Toggle
    function toggleMobileMenu() {
      const navLinks = document.getElementById('navLinks');
      const toggle = document.querySelector('.mobile-menu-toggle');
      navLinks.classList.toggle('active');
      toggle.classList.toggle('active');
    }

    // Back to Top Button
    window.addEventListener('scroll', () => {
      const backToTop = document.getElementById('backToTop');
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // Close mobile menu if open
          document.getElementById('navLinks').classList.remove('active');
          document.querySelector('.mobile-menu-toggle').classList.remove('active');
        }
      });
    });

    // Form Submission (replace with your form handling)
    document.getElementById('contact-form').addEventListener('submit', function(e) {
      e.preventDefault();
      // Add your form submission logic here
      alert('Thank you for your message! I will get back to you soon.');
      this.reset();
    });

    // Project Filtering
    function filterProjects(category) {
      // Update active button
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      event.target.classList.add('active');
      
      // Filter projects (implement based on your project structure)
      console.log('Filtering projects by:', category);
    }

    // Loading overlay
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('loadingOverlay').classList.remove('active');
      }, 500);
    });
