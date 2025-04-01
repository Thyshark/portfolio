document.addEventListener('DOMContentLoaded', function() {
    fetchProjects();
});

function fetchProjects() {
    fetch('php/get_projects.php')
        .then(response => response.json())
        .then(data => {
            displayProjects(data);
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
            // Display default projects if API fails
            displayProjects(getDefaultProjects());
        });
}

function displayProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="images/projects/${project.image}" alt="${project.title}">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github_url}" target="_blank"><i class="fab fa-github"></i> Code</a>
                    ${project.live_url ? `<a href="${project.live_url}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
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
            "image": "api-project.jpg",
            "tags": ["FastAPI", "Rust", "Banking", "WSO2"],
            "github_url": "https://github.com/kenkimiri/banking-api",
            "live_url": null
        },
        {
            "title": "Cloud ERP Solution",
            "description": "Engineered and deployed secure, scalable APIs for a cloud-based ERP solution using Python and FastAPI.",
            "image": "erp-project.jpg",
            "tags": ["Python", "FastAPI", "Azure", "Docker"],
            "github_url": "https://github.com/kenkimiri/erp-solution",
            "live_url": "https://erp.kenkimiri.com"
        },
        {
            "title": "Portfolio Website",
            "description": "A responsive portfolio website built with HTML, CSS, and JavaScript showcasing my projects and skills.",
            "image": "portfolio-project.jpg",
            "tags": ["HTML", "CSS", "JavaScript", "Responsive"],
            "github_url": "https://github.com/kenkimiri/portfolio",
            "live_url": "https://kenkimiri.com"
        }
    ];
}