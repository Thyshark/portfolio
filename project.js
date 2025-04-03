document.addEventListener('DOMContentLoaded', function() {
    // Check if projects section exists
    if (!document.getElementById('projects-grid')) {
        console.error('Projects grid element not found');
        return;
    }

    // Load Font Awesome if not already loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
    }

    fetchProjects();
});

async function fetchProjects() {
    try {
        const response = await fetch('php/get_project.php');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // If no projects returned, use defaults
        if (!data || data.length === 0) {
            console.warn('No projects returned from API, using defaults');
            displayProjects(getDefaultProjects());
        } else {
            displayProjects(data);
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
        displayProjects(getDefaultProjects());
    }
}

function displayProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        // Create fallback for missing image
        const imagePath = `images/projects/${project.image || 'default-project.jpg'}`;
        
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${imagePath}" alt="${project.title}" 
                     onerror="this.src='images/projects/default-project.jpg'">
            </div>
            <div class="project-content">
                <h3>${project.title || 'Untitled Project'}</h3>
                <p>${project.description || 'No description available'}</p>
                <div class="project-tags">
                    ${(project.tags || []).map(tag => 
                        `<span class="project-tag">${tag}</span>`
                    ).join('')}
                </div>
                <div class="project-links">
                    ${project.github_url ? 
                        `<a href="${project.github_url}" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-github"></i> Code
                        </a>` : ''
                    }
                    ${project.live_url ? 
                        `<a href="${project.live_url}" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i> Demo
                        </a>` : ''
                    }
                </div>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });
}

function getDefaultProjects() {
    return [
        {
            "title": "Banking API Integration",
            "description": "Developed a secure banking API integration system using FastAPI and Rust that improved transaction speeds by 25%.",
            "image": "bank.JPG",
            "tags": ["FastAPI", "Rust", "Banking", "WSO2"],
            "github_url": "https://github.com/Thyshark/API-status-checker",
            "live_url": "https://buni.kcbgroup.com/"
        },
        {
            "title": "Cloud ERP Solution",
            "description": "Engineered and deployed secure, scalable APIs for a cloud-based ERP solution using Python and FastAPI.",
            "image": "erp.JPG",
            "tags": ["Python", "FastAPI", "Azure", "Docker"],
            "github_url": "https://github.com/kenhttps://github.com/EBIS-CLOUD/ebisapp",
            "live_url": "https://ebisclouderp.com/"
        },
        {
            "title": "Portfolio Website",
            "description": "A responsive portfolio website built with HTML, CSS, and JavaScript showcasing my projects and skills.",
            "image": "portfolio-project.jpg",
            "tags": ["HTML", "CSS", "JavaScript", "Responsive"],
            "github_url": "https://github.com/Thyshark/portfolio",
            "live_url": "https://thyshark.github.io/portfolio/"
        }
    ];
}