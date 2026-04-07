// Custom cursor
const cursor=document.getElementById('cursor');
const ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cursor.style.left=mx+'px';cursor.style.top=my+'px';

  // Mesh background movement
  const circles = document.querySelectorAll('.mesh-circle');
  circles.forEach((c, i) => {
    const shiftX = (mx - window.innerWidth / 2) * (0.02 + i * 0.01);
    const shiftY = (my - window.innerHeight / 2) * (0.02 + i * 0.01);
    c.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
  });
});
function animateRing(){
  rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// 3D Tilt Effect & Parallax Assets
document.addEventListener('mousemove', e => {
  const mx = e.clientX;
  const my = e.clientY;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  // Floating Assets Parallax
  const assets = document.querySelectorAll('.glass-asset');
  assets.forEach(asset => {
    const depth = parseFloat(asset.getAttribute('data-depth'));
    const x = (mx - cx) * depth;
    const y = (my - cy) * depth;
    asset.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.1}deg)`;
  });

  const tiltCards = document.querySelectorAll('.tilt-card, .value-cell, .testi-card, .roadmap-step');
  tiltCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    } else {
      card.style.transform = '';
    }
  });
});

// Magnetic Buttons
const magBtns = document.querySelectorAll('.btn-hero, .nav-cta-btn, .submit-btn, .social-btn');
document.addEventListener('mousemove', e => {
  magBtns.forEach(btn => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const distanceBody = Math.sqrt(x*x + y*y);
    
    if (distanceBody < 100) {
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.05)`;
      btn.style.transition = 'transform 0.1s var(--ease)';
    } else {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s var(--ease)';
    }
  });
});

// Nav compact
window.addEventListener('scroll',()=>{
  const nav = document.getElementById('nav');
  if(nav) nav.classList.toggle('compact',window.scrollY>60);
});

// Scroll reveal & Metric Counter
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('reveal')) {
        entry.target.classList.add('visible');
      }
      if (entry.target.classList.contains('stat-val')) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal, .stat-val').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const stepTime = Math.abs(Math.floor(duration / target));
  let current = 0;
  const timer = setInterval(() => {
    current += Math.ceil(target / 60); // Faster increment for higher numbers
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = current;
    }
  }, 1000 / 60); // 60fps
}

// Service accordion
function toggleService(item){
  const items=[...document.querySelectorAll('.service-item')];
  const idx=items.indexOf(item);
  const panel=document.getElementById('sdp-'+idx);
  const cta=document.getElementById('scr-'+idx);
  const isOpen=panel.classList.contains('open');
  // close all
  document.querySelectorAll('.service-detail-panel').forEach(p=>p.classList.remove('open'));
  document.querySelectorAll('.service-cta-row').forEach(c=>c.style.display='none');
  document.querySelectorAll('.service-expand').forEach(b=>{b.textContent='+';b.style.transform=''});
  if(!isOpen && panel){
    panel.classList.add('open');
    if(cta) cta.style.display='flex';
    item.querySelector('.service-expand').textContent='×';
  }
}

// FAQ accordion
function toggleFAQ(btn){
  const item=btn.closest('.faq-item');
  const isOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
  if(!isOpen) item.classList.add('open');
}

// Form submit
function submitForm(e){
  e.preventDefault();
  document.getElementById('contact-form').style.display='none';
  document.getElementById('form-success').style.display='block';
}

// Typewriter Word Animation
const dynamicWord = document.getElementById('dynamic-word');
const words = ["Expectations.", "Boundaries.", "Doubts.", "Success.", "Limits."];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
  if(!dynamicWord) return;
  const currentWord = words[wordIdx];
  
  if (isDeleting) {
    dynamicWord.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
    typeSpeed = 50;
  } else {
    dynamicWord.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
    typeSpeed = 150;
  }

  if (!isDeleting && charIdx === currentWord.length) {
    isDeleting = true;
    typeSpeed = 2000; // Pause at end
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    typeSpeed = 500;
  }

  setTimeout(typeEffect, typeSpeed);
}
typeEffect();

// Ambient Focus Mode
let ambientTimer;
function resetAmbient() {
  document.body.classList.remove('ambient-mode');
  clearTimeout(ambientTimer);
  ambientTimer = setTimeout(() => {
    document.body.classList.add('ambient-mode');
  }, 10000);
}
document.addEventListener('mousemove', resetAmbient);
document.addEventListener('scroll', resetAmbient);
document.addEventListener('keydown', resetAmbient);
resetAmbient();

// Smooth anchor links
document.querySelectorAll('main a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const targetId = a.getAttribute('href');
    if(targetId === '#') return;
    const t=document.querySelector(targetId);
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
  })
});
