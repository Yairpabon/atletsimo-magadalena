// Hero Slider Functionality

document.addEventListener("DOMContentLoaded", () => {
    initHeroSlider()
    initNewsCarousel()
  })
  
  function initHeroSlider() {
    const slides = document.querySelectorAll(".slide")
    const dots = document.querySelectorAll(".dot")
    const prevBtn = document.querySelector(".prev-slide")
    const nextBtn = document.querySelector(".next-slide")
    let currentSlide = 0
    let slideInterval
  
    // Function to show a specific slide
    function showSlide(index) {
      // Hide all slides
      slides.forEach((slide) => {
        slide.classList.remove("active")
      })
  
      // Remove active class from all dots
      dots.forEach((dot) => {
        dot.classList.remove("active")
      })
  
      // Show the current slide and activate corresponding dot
      slides[index].classList.add("active")
      dots[index].classList.add("active")
  
      // Update current slide index
      currentSlide = index
    }
  
    // Function to show the next slide
    function nextSlide() {
      let next = currentSlide + 1
      if (next >= slides.length) {
        next = 0
      }
      showSlide(next)
    }
  
    // Function to show the previous slide
    function prevSlide() {
      let prev = currentSlide - 1
      if (prev < 0) {
        prev = slides.length - 1
      }
      showSlide(prev)
    }
  
    // Set up event listeners for controls
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide()
        resetInterval()
      })
  
      nextBtn.addEventListener("click", () => {
        nextSlide()
        resetInterval()
      })
    }
  
    // Set up event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index)
        resetInterval()
      })
    })
  
    // Function to start automatic slideshow
    function startSlideshow() {
      slideInterval = setInterval(nextSlide, 5000)
    }
  
    // Function to reset interval after manual navigation
    function resetInterval() {
      clearInterval(slideInterval)
      startSlideshow()
    }
  
    // Initialize the slider
    showSlide(0)
    startSlideshow()
  
    // Pause slideshow on hover
    const slider = document.querySelector(".slider")
    if (slider) {
      slider.addEventListener("mouseenter", () => {
        clearInterval(slideInterval)
      })
  
      slider.addEventListener("mouseleave", () => {
        startSlideshow()
      })
    }
  }
  
  function initNewsCarousel() {
    const carousel = document.querySelector(".news-carousel")
    const prevBtn = document.querySelector(".prev-news")
    const nextBtn = document.querySelector(".next-news")
  
    if (!carousel || !prevBtn || !nextBtn) return
  
    const cardWidth = carousel.querySelector(".news-card").offsetWidth
    const gap = 30 // Gap between cards (should match CSS)
    const visibleCards = Math.floor(carousel.offsetWidth / (cardWidth + gap))
    let currentPosition = 0
    const totalCards = carousel.querySelectorAll(".news-card").length
    const maxPosition = totalCards - visibleCards
  
    // Function to update carousel position
    function updateCarouselPosition() {
      carousel.style.transform = `translateX(-${currentPosition * (cardWidth + gap)}px)`
    }
  
    // Event listeners for controls
    prevBtn.addEventListener("click", () => {
      if (currentPosition > 0) {
        currentPosition--
        updateCarouselPosition()
      }
    })
  
    nextBtn.addEventListener("click", () => {
      if (currentPosition < maxPosition) {
        currentPosition++
        updateCarouselPosition()
      }
    })
  
    // Add transition for smooth movement
    carousel.style.transition = "transform 0.5s ease"
  
    // Update on window resize
    window.addEventListener("resize", () => {
      // Reset position
      currentPosition = 0
      updateCarouselPosition()
    })
  }
  