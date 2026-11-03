import '@fontsource-variable/dm-sans'
import '@fontsource-variable/noto-sans-kr'
import './style.css'
import { contactLinks, projectLinks } from './content.js'

// 빈 링크는 이동할 수 없는 임시 텍스트로 유지합니다.
function applyWebLink(element, url, label) {
  if (!element || !url) return
  try {
    const parsed = new URL(url)
    if (!['https:', 'http:'].includes(parsed.protocol)) return
    element.href = parsed.href
    element.target = '_blank'
    element.rel = 'noopener noreferrer'
    element.removeAttribute('aria-disabled')
    const labelElement = element.querySelector('[data-link-label]') ?? element.querySelector('span')
    labelElement.textContent = label
  } catch {
    // URL을 완성하기 전까지 기존 임시 텍스트를 표시합니다.
  }
}

Object.entries(projectLinks).forEach(([key, url]) => {
  applyWebLink(document.querySelector(`[data-project-link="${key}"]`), url, '프로젝트 살펴보기')
})
Object.entries(contactLinks).forEach(([key, { url, label }]) => {
  const element = document.querySelector(`[data-contact-link="${key}"]`)
  if (key === 'email') {
    const email = url.trim()
    if (element && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
      element.href = `mailto:${encodeURIComponent(email).replace('%40', '@')}`
      element.removeAttribute('aria-disabled')
      element.querySelector('[data-link-label]').textContent = email
    }
  } else {
    applyWebLink(element, url, label)
  }
})

const menuToggle = document.querySelector('.menu-toggle')
const navigation = document.querySelector('#main-navigation')
const mobileQuery = window.matchMedia('(max-width: 760px)')
function closeMenu(returnFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false')
  menuToggle.setAttribute('aria-label', '메뉴 열기')
  navigation.classList.remove('is-open')
  if (returnFocus) menuToggle.focus()
}
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true'
  menuToggle.setAttribute('aria-expanded', String(!isOpen))
  menuToggle.setAttribute('aria-label', isOpen ? '메뉴 열기' : '메뉴 닫기')
  navigation.classList.toggle('is-open', !isOpen)
})
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu()
})
document.addEventListener('click', (event) => {
  if (!event.target.closest('.header-inner')) closeMenu()
})
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true)
})
mobileQuery.addEventListener('change', () => closeMenu())

// IntersectionObserver가 없는 환경에서도 모든 내용이 보입니다.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      revealObserver.unobserve(entry.target)
    })
  }, { threshold: 0.08 })
  document.documentElement.dataset.animateReveals = ''
  document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element))

  const navLinks = [...navigation.querySelectorAll('a')]
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      navLinks.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
    })
  }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 })
  document.querySelectorAll('main > section[id]').forEach((section) => sectionObserver.observe(section))
}

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const motionButton = document.querySelector('#motion-toggle')
let motionPreference = null
try {
  const saved = localStorage.getItem('narae-motion')
  if (['reduced', 'full'].includes(saved)) motionPreference = saved
} catch { /* 저장소 없이도 모션 전환은 작동합니다. */ }
function updateMotion() {
  const reduced = motionPreference ? motionPreference === 'reduced' : motionQuery.matches
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'
  motionButton.setAttribute('aria-pressed', String(reduced))
  motionButton.querySelector('[data-motion-label]').textContent = reduced ? '모션 켜기' : '모션 줄이기'
}
motionButton.addEventListener('click', () => {
  motionPreference = document.documentElement.dataset.motion === 'reduced' ? 'full' : 'reduced'
  try { localStorage.setItem('narae-motion', motionPreference) } catch { /* 세션 내 선택을 유지합니다. */ }
  updateMotion()
})
motionQuery.addEventListener('change', updateMotion)
updateMotion()

// 미세한 입체 반응은 마우스를 사용하는 환경에서만 적용합니다.
const heroArt = document.querySelector('.hero-art')
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
let artFrame = 0
heroArt.addEventListener('pointermove', (event) => {
  if (!finePointer.matches || document.documentElement.dataset.motion === 'reduced') return
  const bounds = heroArt.getBoundingClientRect()
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -12
  cancelAnimationFrame(artFrame)
  artFrame = requestAnimationFrame(() => {
    heroArt.style.setProperty('--rotate-x', `${y}deg`)
    heroArt.style.setProperty('--rotate-y', `${x}deg`)
  })
})
heroArt.addEventListener('pointerleave', () => {
  cancelAnimationFrame(artFrame)
  heroArt.style.setProperty('--rotate-x', '0deg')
  heroArt.style.setProperty('--rotate-y', '0deg')
})
