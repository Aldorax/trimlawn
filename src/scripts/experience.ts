import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initExperience() {
  const root = document.querySelector<HTMLElement>('.experience');
  if (!root) return;

  // Split authored line breaks, keeping a single accessible heading name.
  root.querySelectorAll<HTMLElement>('h2:not(.ink-heading), h3').forEach(heading => {
    const lines = heading.innerHTML.split(/<br\s*\/?\s*>/i);
    heading.setAttribute('aria-label', lines.map(line => line.replace(/<[^>]*>/g, '')).join(' '));
    heading.innerHTML = lines.map(line => `<span class="line-mask" aria-hidden="true"><span class="line-inner">${line}</span></span>`).join('');
  });
  const inkHeading = root.querySelector<HTMLElement>('.ink-heading');
  if (inkHeading) {
    const lines = inkHeading.innerHTML.split(/<br\s*\/?\s*>/i);
    inkHeading.setAttribute('aria-label', lines.join(' '));
    inkHeading.innerHTML = lines.map(line => `<span class="line-mask" aria-hidden="true">${line.split(' ').map(word => `<span class="ink-word">${word}</span>`).join(' ')}</span>`).join('');
  }

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    root.querySelectorAll<HTMLElement>('h2:not(.ink-heading), h3').forEach(heading => {
      gsap.from(heading.querySelectorAll('.line-inner'), {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: { trigger: heading, start: 'top 90%', once: true },
      });
    });

    root.querySelectorAll('.section-heading > p, .section-heading > div, .about-copy > p, .chapter-detail, .soil-chapter > p, .soil-chapter > a, .review-feature > p, .nature-bottom > p').forEach(element => {
      gsap.from(element, {
        y: 24, opacity: 0, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 94%', once: true },
      });
    });

    root.querySelectorAll('.service-visual, .soil-frame, .comparison, .second-project > img, .third-project > img, .team-portrait').forEach(frame => {
      gsap.from(frame, {
        clipPath: 'inset(9% 4% 9% 4% round 18px)', duration: 1.15, ease: 'power3.out',
        scrollTrigger: { trigger: frame, start: 'top 90%', once: true },
      });
    });
    gsap.from('.experience .service-option', {
      y: 30, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.service-options', start: 'top 90%', once: true },
    });
    gsap.from('.experience .review-feature blockquote', {
      y: 35, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.review-feature', start: 'top 88%', once: true },
    });
    gsap.from('.experience .questions details', {
      y: 20, opacity: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out',
      scrollTrigger: { trigger: '.questions', start: 'top 88%', once: true },
    });
    if (inkHeading) {
      gsap.from(inkHeading.querySelectorAll('.ink-word'), {
        opacity: 0.3, stagger: 0.15, ease: 'none',
        scrollTrigger: { trigger: '.nature-statement', start: 'top 72%', end: 'center 40%', scrub: true },
      });
    }
    gsap.fromTo('.contact-picture img', { scale: 1.12, yPercent: -4 }, {
      scale: 1.02, yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: '.contact-banner', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    return () => { /* matchMedia restores all authored styles automatically. */ };
  });

  media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
    const photos = Array.from(root.querySelectorAll<HTMLElement>('.soil-photo'));
    const showPhoto = (index: number) => {
      photos.forEach((photo, i) => gsap.to(photo, { opacity: i === index ? 1 : 0, duration: 0.6, overwrite: true }));
    };
    root.querySelectorAll('.soil-chapter').forEach((chapter, index) => {
      ScrollTrigger.create({
        trigger: chapter, start: 'top 55%', end: 'bottom 55%',
        onEnter: () => showPhoto(index), onEnterBack: () => showPhoto(index),
      });
    });
    photos.forEach(photo => gsap.fromTo(photo, { scale: 1.07, yPercent: -2 }, {
      scale: 1.02, yPercent: 2, ease: 'none',
      scrollTrigger: { trigger: '.soil-story', start: 'top bottom', end: 'bottom top', scrub: true },
    }));
    gsap.from('.third-project', {
      y: 65, ease: 'none',
      scrollTrigger: { trigger: '.project-grid', start: 'center bottom', end: 'bottom 70%', scrub: true },
    });
  });

  // Disclosure and tab changes alter document height; refresh only on those changes.
  root.querySelectorAll('details').forEach(details => details.addEventListener('toggle', () => ScrollTrigger.refresh()));
  root.querySelectorAll('[role="tab"]').forEach(tab => tab.addEventListener('click', () => requestAnimationFrame(() => ScrollTrigger.refresh())));
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
