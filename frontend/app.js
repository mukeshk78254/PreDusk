
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://predusk-1-i4sy.onrender.com';

class ProfileApp {
    constructor() {
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadProfile();
        this.loadStats();
    }

    attachEventListeners() {
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.search();
            }
        });
    }

    async loadStats() {
        try {
            const [profileRes, projectsRes, skillsRes] = await Promise.all([
                fetch(`${API_URL}/api/profiles`),
                fetch(`${API_URL}/api/projects`),
                fetch(`${API_URL}/api/skills/top?limit=100`)
            ]);

            const profileData = await profileRes.json();
            const projectsData = await projectsRes.json();
            const skillsData = await skillsRes.json();

            this.renderStats({
                profiles: profileData.count || 0,
                projects: projectsData.count || 0,
                skills: skillsData.count || 0
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    renderStats(stats) {
        const statsHTML = `
            <div class="stat-card">
                <div class="stat-number">${stats.profiles}</div>
                <div class="stat-label">Profiles</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.projects}</div>
                <div class="stat-label">Projects</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.skills}</div>
                <div class="stat-label">Unique Skills</div>
            </div>
        `;
        document.getElementById('stats').innerHTML = statsHTML;
    }

    async loadProfile() {
        try {
            this.showLoading();
            const response = await fetch(`${API_URL}/api/profiles`);
            const data = await response.json();
            
            if (data.success && data.data.length > 0) {
                this.renderProfile(data.data[0]);
            } else {
                this.showError('No profile found');
            }
        } catch (error) {
            this.showError('Error loading profile: ' + error.message);
        }
    }

    async search() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) {
            alert('Please enter a search term');
            return;
        }

        try {
            this.showLoading();
            const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success && data.data.length > 0) {
                this.renderMultipleProfiles(data.data, `Search results for "${query}"`);
            } else {
                this.showError(`No results found for "${query}"`);
            }
        } catch (error) {
            this.showError('Error searching: ' + error.message);
        }
    }

    async listAllProjects() {
        try {
            this.showLoading();
            const response = await fetch(`${API_URL}/api/projects`);
            const data = await response.json();
            
            if (data.success) {
                this.renderProjects(data.data, 'All Projects');
            } else {
                this.showError('Error loading projects');
            }
        } catch (error) {
            this.showError('Error loading projects: ' + error.message);
        }
    }

    async filterBySkill(skill) {
        try {
            this.showLoading();
            const response = await fetch(`${API_URL}/api/projects?skill=${encodeURIComponent(skill)}`);
            const data = await response.json();
            
            if (data.success) {
                this.renderProjects(data.data, `Projects using ${skill}`);
            } else {
                this.showError('Error loading projects');
            }
        } catch (error) {
            this.showError('Error loading projects: ' + error.message);
        }
    }

    async getTopSkills() {
        try {
            this.showLoading();
            const response = await fetch(`${API_URL}/api/skills/top?limit=20`);
            const data = await response.json();
            
            if (data.success) {
                this.renderTopSkills(data.data);
            } else {
                this.showError('Error loading skills');
            }
        } catch (error) {
            this.showError('Error loading skills: ' + error.message);
        }
    }

    renderProfile(profile) {
        const html = `
            <div class="profile-card">
                <div class="profile-header">
                    <div>
                        <div class="profile-name">${profile.name}</div>
                        <div class="profile-email">${profile.email}</div>
                    </div>
                </div>

                ${this.renderEducation(profile.education)}
                ${this.renderSkills(profile.skills)}
                ${this.renderProjectsList(profile.projects)}
                ${this.renderWorkExperience(profile.work)}
                ${this.renderLinks(profile.links)}
            </div>
        `;
        document.getElementById('results').innerHTML = html;
    }

    renderEducation(education) {
        if (!education || education.length === 0) return '';
        
        return `
            <div class="section">
                <div class="section-title">Education</div>
                ${education.map(edu => `
                    <div class="work-item">
                        <strong>${edu.degree} in ${edu.field}</strong><br>
                        ${edu.institution} (${edu.startYear} - ${edu.endYear})
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSkills(skills) {
        if (!skills || skills.length === 0) return '';
        
        return `
            <div class="section">
                <div class="section-title">Skills</div>
                <div class="skills-container">
                    ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    renderProjectsList(projects) {
        if (!projects || projects.length === 0) return '';
        
        return `
            <div class="section">
                <div class="section-title">Projects</div>
                ${projects.map(project => this.renderProjectCard(project)).join('')}
            </div>
        `;
    }

    renderProjectCard(project) {
        return `
            <div class="project-card">
                <div class="project-title">${project.title}</div>
                <div class="project-description">${project.description || ''}</div>
                ${project.technologies && project.technologies.length > 0 ? `
                    <div style="margin: 10px 0;">
                        ${project.technologies.map(tech => `<span class="skill-tag" style="font-size: 12px; padding: 4px 8px;">${tech}</span>`).join(' ')}
                    </div>
                ` : ''}
                ${project.links ? `
                    <div class="project-links">
                        ${project.links.github ? `<a href="${project.links.github}" class="project-link" target="_blank">GitHub</a>` : ''}
                        ${project.links.demo ? `<a href="${project.links.demo}" class="project-link" target="_blank">Live Demo</a>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderWorkExperience(work) {
        if (!work || work.length === 0) return '';
        
        return `
            <div class="section">
                <div class="section-title">Work Experience</div>
                ${work.map(w => `
                    <div class="work-item">
                        <strong>${w.position}</strong> at ${w.company}<br>
                        <small>${new Date(w.startDate).toLocaleDateString()} - ${w.endDate ? new Date(w.endDate).toLocaleDateString() : 'Present'}</small><br>
                        ${w.description || ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderLinks(links) {
        if (!links) return '';
        
        return `
            <div class="section">
                <div class="section-title">Links</div>
                <div class="social-links">
                    ${links.github ? `<a href="${links.github}" class="social-link" target="_blank">GitHub</a>` : ''}
                    ${links.linkedin ? `<a href="${links.linkedin}" class="social-link" target="_blank">LinkedIn</a>` : ''}
                    ${links.portfolio ? `<a href="${links.portfolio}" class="social-link" target="_blank">Portfolio</a>` : ''}
                    ${links.resume ? `<a href="${links.resume}" class="social-link" target="_blank">Resume</a>` : ''}
                </div>
            </div>
        `;
    }

    renderProjects(projects, title) {
        let html = `<h2 style="margin-bottom: 20px; color: #667eea;">${title} (${projects.length})</h2>`;
        html += projects.map(project => this.renderProjectCard(project)).join('');
        document.getElementById('results').innerHTML = html;
    }

    renderMultipleProfiles(profiles, title) {
        let html = `<h2 style="margin-bottom: 20px; color: #667eea;">${title} (${profiles.length})</h2>`;
        html += profiles.map(profile => this.renderProfile(profile)).join('');
        document.getElementById('results').innerHTML = html;
    }

    renderTopSkills(skills) {
        let html = '<h2 style="margin-bottom: 20px; color: #667eea;">Top Skills</h2>';
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">';
        skills.forEach((item, index) => {
            html += `
                <div class="project-card" style="cursor: pointer;" onclick="app.filterBySkill('${item.skill}')">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; font-size: 18px;">#${index + 1} ${item.skill}</span>
                        <span class="skill-tag">${item.count}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        document.getElementById('results').innerHTML = html;
    }

    showLoading() {
        document.getElementById('results').innerHTML = '<div class="loading">Loading...</div>';
    }

    showError(message) {
        document.getElementById('results').innerHTML = `<div class="error">${message}</div>`;
    }
}

let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new ProfileApp();
});
