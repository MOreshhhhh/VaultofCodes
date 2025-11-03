const toggleIngredients = document.getElementById('toggleIngredients');
const toggleSteps = document.getElementById('toggleSteps');
const ingredients = document.getElementById('ingredients');
const steps = document.getElementById('steps');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.getElementById('progress');

let currentStep = 0;

toggleIngredients.onclick = () => {
  ingredients.classList.toggle('hidden');
  toggleIngredients.textContent = ingredients.classList.contains('hidden') ? 'Show Ingredients' : 'Hide Ingredients';
};

toggleSteps.onclick = () => {
  steps.classList.toggle('hidden');
  toggleSteps.textContent = steps.classList.contains('hidden') ? 'Show Steps' : 'Hide Steps';
};

startBtn.onclick = () => {
  currentStep = 0;
  nextBtn.disabled = false;
  highlightStep(currentStep);
  updateProgress();
};

nextBtn.onclick = () => {
  if (currentStep < steps.children.length - 1) {
    currentStep++;
    highlightStep(currentStep);
    updateProgress();
  } else {
    nextBtn.disabled = true;
    alert("You're done! Enjoy your cake!");
  }
};

function highlightStep(index) {
  [...steps.children].forEach((step, i) => {
    step.style.background = i === index ? '#ffeadb' : 'transparent';
  });
}

function updateProgress() {
  const percentage = ((currentStep + 1) / steps.children.length) * 100;
  progress.style.width = `${percentage}%`;
}
