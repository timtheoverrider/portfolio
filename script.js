const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function enableTiltEffect(tiltElements) {
  if (!tiltElements || tiltElements.length === 0) return;

  const maxTiltDegrees = 10;
  const maxTranslateZ = 60; // For layered 3D shine

  tiltElements.forEach((element) => {
    let elementBounds = null;

    function updateBounds() {
      elementBounds = element.getBoundingClientRect();
    }

    function handleMouseMove(event) {
      if (!elementBounds) updateBounds();
      const centerX = elementBounds.left + elementBounds.width / 2;
      const centerY = elementBounds.top + elementBounds.height / 2;
      const percentX = (event.clientX - centerX) / (elementBounds.width / 2);
      const percentY = (event.clientY - centerY) / (elementBounds.height / 2);

      const tiltX = Math.max(Math.min(percentY * maxTiltDegrees, maxTiltDegrees), -maxTiltDegrees);
      const tiltY = Math.max(Math.min(-percentX * maxTiltDegrees, maxTiltDegrees), -maxTiltDegrees);

      element.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      element.style.transition = 'transform 60ms ease-out';
    }

    function handleEnter() {
      element.style.willChange = 'transform';
    }

    function handleLeave() {
      element.style.transition = 'transform 300ms ease';
      element.style.transform = 'rotateX(0) rotateY(0)';
    }

    element.addEventListener('mouseenter', handleEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleLeave);
    window.addEventListener('scroll', updateBounds, { passive: true });
    window.addEventListener('resize', updateBounds);
  });
}

function enableRevealOnScroll() {
  const revealElements = Array.from(document.querySelectorAll('.reveal'));
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function enableParallax() {
  const badgeScene = document.querySelector('.badge-scene');
  if (!badgeScene) return;

  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const parallax = Math.min(scrollY / 20, 60);
    badgeScene.style.transform = `translateY(${parallax * 0.2}px)`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function enableNavToggle() {
  const toggleButton = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggleButton || !nav) return;

  function onToggle() {
    const isOpen = nav.classList.toggle('open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  }

  toggleButton.addEventListener('click', onToggle);
}

function updateYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

window.addEventListener('DOMContentLoaded', () => {
  updateYear();

  if (!prefersReducedMotion) {
    const tiltElements = document.querySelectorAll('.tilt, .project-card, .contact-card');
    enableTiltEffect(Array.from(tiltElements));
    enableParallax();
  }

  enableRevealOnScroll();
  enableNavToggle();
});



