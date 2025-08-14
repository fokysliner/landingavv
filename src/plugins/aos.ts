import AOS from 'aos'
import 'aos/dist/aos.css'

export function initAOS() {
  AOS.init({
    once: false,       
    mirror: true,       
    offset: 80,
    duration: 700,
    easing: 'ease-out-cubic',
    startEvent: 'DOMContentLoaded',
  })
}

export function refreshAOS() {
  AOS.refreshHard()
}
