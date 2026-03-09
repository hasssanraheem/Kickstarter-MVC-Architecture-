// Auto-dismiss flash messages after 4 seconds
document.querySelectorAll('.alert').forEach(alert => {
  setTimeout(() => {
    alert.style.transition = 'opacity 0.5s';
    alert.style.opacity = '0';
    setTimeout(() => alert.remove(), 500);
  }, 4000);
});

// Confirm delete actions
document.querySelectorAll('[data-confirm]').forEach(el => {
  el.addEventListener('click', e => {
    if (!confirm(el.dataset.confirm)) e.preventDefault();
  });
});

// Auto-update funding goal min for pledge amount
const goalInput = document.querySelector('[name="fundingGoal"]');
const pledgeAmount = document.querySelector('[name="amount"]');
if (goalInput && pledgeAmount) {
  pledgeAmount.setAttribute('min', 1);
}

// Character counter for short description
const shortDesc = document.querySelector('[name="shortDescription"]');
if (shortDesc) {
  const counter = document.createElement('small');
  counter.style.color = '#888';
  shortDesc.parentNode.appendChild(counter);
  const update = () => counter.textContent = `${shortDesc.value.length}/200`;
  shortDesc.addEventListener('input', update);
  update();
}
