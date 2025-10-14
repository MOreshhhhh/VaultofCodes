// DOM references
const form = document.getElementById('resumeForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const summaryInput = document.getElementById('summary');

const educationList = document.getElementById('educationList');
const experienceList = document.getElementById('experienceList');
const addEducationBtn = document.getElementById('addEducation');
const addExperienceBtn = document.getElementById('addExperience');

const skillsContainer = document.getElementById('skillsContainer');
const addSkillBtn = document.getElementById('addSkillBtn');
const newSkillInput = document.getElementById('newSkillInput');

const pvName = document.getElementById('pvName');
const pvEmail = document.getElementById('pvEmail');
const pvPhone = document.getElementById('pvPhone');
const pvSummary = document.getElementById('pvSummary');
const pvEducation = document.getElementById('pvEducation');
const pvExperience = document.getElementById('pvExperience');
const pvSkills = document.getElementById('pvSkills');

const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

let eduCount = 0;
let expCount = 0;

// Helpers: create inputs for education/experience
function createEducationRow(data = {}) {
  eduCount++;
  const id = `edu-${eduCount}`;
  const wrapper = document.createElement('div');
  wrapper.className = 'edu-row';
  wrapper.innerHTML = `
    <div class="row-entry">
      <input placeholder="Degree (e.g. B.Sc Computer Science)" data-key="degree" />
      <input placeholder="Institute (e.g. University)" data-key="institute" />
      <input placeholder="Year (e.g. 2024)" data-key="year" />
      <button type="button" class="btn small remove-row">Remove</button>
    </div>
  `;
  // populate if provided
  if (data.degree) wrapper.querySelector('[data-key="degree"]').value = data.degree;
  if (data.institute) wrapper.querySelector('[data-key="institute"]').value = data.institute;
  if (data.year) wrapper.querySelector('[data-key="year"]').value = data.year;

  educationList.appendChild(wrapper);
  // add listeners for live update
  wrapper.querySelectorAll('input').forEach(inp => inp.addEventListener('input', renderPreview));
  wrapper.querySelector('.remove-row').addEventListener('click', () => { wrapper.remove(); renderPreview(); updateProgress(); });
  renderPreview(); updateProgress();
}

function createExperienceRow(data = {}) {
  expCount++;
  const wrapper = document.createElement('div');
  wrapper.className = 'exp-row';
  wrapper.innerHTML = `
    <div class="row-entry">
      <input placeholder="Role (e.g. Frontend Developer)" data-key="role" />
      <input placeholder="Company" data-key="company" />
      <input placeholder="Dates (e.g. 2021 - Present)" data-key="dates" />
      <textarea placeholder="Short description" data-key="desc" rows="2"></textarea>
      <button type="button" class="btn small remove-row">Remove</button>
    </div>
  `;
  if (data.role) wrapper.querySelector('[data-key="role"]').value = data.role;
  if (data.company) wrapper.querySelector('[data-key="company"]').value = data.company;
  if (data.dates) wrapper.querySelector('[data-key="dates"]').value = data.dates;
  if (data.desc) wrapper.querySelector('[data-key="desc"]').value = data.desc;

  experienceList.appendChild(wrapper);
  wrapper.querySelectorAll('input, textarea').forEach(inp => inp.addEventListener('input', renderPreview));
  wrapper.querySelector('.remove-row').addEventListener('click', () => { wrapper.remove(); renderPreview(); updateProgress(); });
  renderPreview(); updateProgress();
}

// initial starter rows
createEducationRow({degree: 'B.Sc Computer Science', institute: 'Your University', year: '2023'});
createExperienceRow({role: 'Intern', company: 'Company Ltd', dates: '2023', desc: 'Worked on web features.'});

// add handlers
addEducationBtn.addEventListener('click', () => createEducationRow());
addExperienceBtn.addEventListener('click', () => createExperienceRow());

// skills: toggles and custom add
skillsContainer.addEventListener('change', () => { renderPreview(); updateProgress(); });

addSkillBtn.addEventListener('click', () => {
  const val = newSkillInput.value.trim();
  if (!val) return;
  const label = document.createElement('label');
  label.className = 'chip';
  label.innerHTML = `<input type="checkbox" value="${escapeHtml(val)}" checked /> ${escapeHtml(val)} <button class="btn small remove-skill" title="remove" type="button">x</button>`;
  skillsContainer.appendChild(label);
  // remove skill handler
  label.querySelector('.remove-skill').addEventListener('click', () => { label.remove(); renderPreview(); updateProgress(); });
  newSkillInput.value = '';
  renderPreview(); updateProgress();
});

// escape to avoid accidental HTML injection in value display
function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') }

// live preview updates
[nameInput, emailInput, phoneInput, summaryInput].forEach(inp => inp.addEventListener('input', () => { renderPreview(); updateProgress(); }));

function renderPreview() {
  pvName.textContent = nameInput.value.trim() || 'Your Name';
  pvEmail.textContent = emailInput.value.trim() || 'email@example.com';
  pvPhone.textContent = phoneInput.value.trim() || '+00 00000 00000';
  pvSummary.textContent = summaryInput.value.trim() || 'A short professional summary will appear here as you type.';

  // Education
  pvEducation.innerHTML = '';
  const eduRows = Array.from(educationList.querySelectorAll('.edu-row'));
  if (eduRows.length === 0) {
    pvEducation.innerHTML = '<p class="muted">No education added.</p>';
  } else {
    eduRows.forEach(row => {
      const degree = row.querySelector('[data-key="degree"]').value.trim();
      const institute = row.querySelector('[data-key="institute"]').value.trim();
      const year = row.querySelector('[data-key="year"]').value.trim();
      const node = document.createElement('div');
      node.className = 'entry';
      node.innerHTML = `<strong>${escapeHtml(degree || 'Degree')}</strong><div class="meta">${escapeHtml(institute || 'Institute')} • ${escapeHtml(year || '')}</div>`;
      pvEducation.appendChild(node);
    });
  }

  // Experience
  pvExperience.innerHTML = '';
  const expRows = Array.from(experienceList.querySelectorAll('.exp-row'));
  if (expRows.length === 0) {
    pvExperience.innerHTML = '<p class="muted">No experience added.</p>';
  } else {
    expRows.forEach(row => {
      const role = row.querySelector('[data-key="role"]').value.trim();
      const company = row.querySelector('[data-key="company"]').value.trim();
      const dates = row.querySelector('[data-key="dates"]').value.trim();
      const desc = row.querySelector('[data-key="desc"]').value.trim();
      const node = document.createElement('div');
      node.className = 'entry';
      node.innerHTML = `<strong>${escapeHtml(role || 'Role')}</strong><div class="meta">${escapeHtml(company || '')} • ${escapeHtml(dates || '')}</div><div>${escapeHtml(desc || '')}</div>`;
      pvExperience.appendChild(node);
    });
  }

  // Skills
  pvSkills.innerHTML = '';
  const checked = Array.from(skillsContainer.querySelectorAll('input[type="checkbox"]:checked'));
  if (checked.length === 0) {
    pvSkills.innerHTML = '<span class="muted">No skills selected.</span>';
  } else {
    checked.forEach(chk => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = chk.value;
      pvSkills.appendChild(chip);
    });
  }
}

// progress meter: counts how many meaningful fields/sections are filled
function updateProgress() {
  // list of items to check
  const checks = [
    nameInput.value.trim(),
    emailInput.value.trim(),
    phoneInput.value.trim(),
    summaryInput.value.trim(),
    // education present
    educationList.querySelectorAll('.edu-row').length > 0 ? '1' : '',
    // experience present
    experienceList.querySelectorAll('.exp-row').length > 0 ? '1' : '',
    // any skill checked
    skillsContainer.querySelectorAll('input[type="checkbox"]:checked').length > 0 ? '1' : ''
  ];
  const filled = checks.filter(Boolean).length;
  const percent = Math.round((filled / checks.length) * 100);
  progressFill.style.width = percent + '%';
  progressText.textContent = percent + '% complete';
}

// clear form & preview
clearBtn.addEventListener('click', () => {
  if (!confirm('Clear all inputs and preview?')) return;
  form.reset();
  // remove dynamic rows and recreate starters
  educationList.innerHTML = '';
  experienceList.innerHTML = '';
  // remove dynamically added skill chips except initial four (we'll keep base ones)
  // remove any chips that contain a remove button (our custom ones)
  Array.from(skillsContainer.querySelectorAll('.chip .remove-skill')).forEach(btn => btn.parentElement.remove());
  // recreate starter rows
  createEducationRow();
  createExperienceRow();
  renderPreview(); updateProgress();
});

// download as PDF using html2pdf library
downloadBtn.addEventListener('click', () => {
  const preview = document.getElementById('resumePreview');
  // simple styling options
  const opt = {
    margin:       0.3,
    filename:     (nameInput.value.trim() || 'resume') + '.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  // animate subtle scale to indicate capture
  preview.style.transform = 'scale(0.995)';
  setTimeout(() => preview.style.transform = '', 250);
  html2pdf().set(opt).from(preview).save();
});

// initialize preview
renderPreview();
updateProgress();
