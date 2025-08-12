// Main JavaScript File

document.addEventListener("DOMContentLoaded", () => {
    // Initialize all components
    initNavigation()
    initScrollAnimations()
    initModal()
    initFormValidation()
  
    // Add dark mode toggle functionality
    const darkModeToggle = document.getElementById("darkmode-toggle")
    darkModeToggle.addEventListener("change", toggleDarkMode)
  
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.body.setAttribute("data-theme", "dark")
      darkModeToggle.checked = true
    }
  })
  
  // Navigation functionality
  function initNavigation() {
    const menuToggle = document.querySelector(".menu-toggle")
    const menu = document.querySelector(".menu")
    const hasSubmenuItems = document.querySelectorAll(".has-submenu")
  
    // Toggle mobile menu
    menuToggle.addEventListener("click", function () {
      this.classList.toggle("active")
      menu.classList.toggle("active")
      document.body.classList.toggle("menu-open")
    })
  
    // Handle submenu toggles on mobile
    hasSubmenuItems.forEach((item) => {
      const link = item.querySelector("a")
  
      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault()
          item.classList.toggle("active")
        }
      })
    })
  
    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target) && menu.classList.contains("active")) {
        menu.classList.remove("active")
        menuToggle.classList.remove("active")
        document.body.classList.remove("menu-open")
      }
    })
  
    // Add active class to current page link
    const currentLocation = window.location.pathname
    const menuLinks = document.querySelectorAll(".menu a")
  
    menuLinks.forEach((link) => {
      if (link.getAttribute("href") === currentLocation) {
        link.classList.add("active")
      }
    })
  
    // Shrink header on scroll
    const header = document.querySelector(".header")
    let lastScrollTop = 0
  
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  
      if (scrollTop > 100) {
        header.classList.add("shrink")
      } else {
        header.classList.remove("shrink")
      }
  
      lastScrollTop = scrollTop
    })
  }
  
  // Scroll animations
  function initScrollAnimations() {
    const revealElements = document.querySelectorAll(".reveal")
  
    function checkReveal() {
      const windowHeight = window.innerHeight
      const revealPoint = 100
  
      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top
  
        if (elementTop < windowHeight - revealPoint) {
          element.classList.add("active")
        }
      })
  
      // Check if stats section is visible to start counter animation
      const statsSection = document.querySelector(".stats")
      if (statsSection) {
        const statsSectionTop = statsSection.getBoundingClientRect().top
  
        if (statsSectionTop < windowHeight - 100 && !statsSection.classList.contains("counted")) {
          startCounting()
          statsSection.classList.add("counted")
        }
      }
  
      // Check if territory path is visible to animate
      const territoryPath = document.querySelector(".territory-path")
      if (territoryPath) {
        const pathTop = territoryPath.getBoundingClientRect().top
  
        if (pathTop < windowHeight - 100) {
          territoryPath.classList.add("animate")
        }
      }
    }
  
    // Initial check
    checkReveal()
  
    // Check on scroll
    window.addEventListener("scroll", checkReveal)
  }
  
  // Modal functionality
  function initModal() {
    const openModalBtn = document.getElementById("open-registration")
    const modal = document.getElementById("registration-modal")
    const closeModal = document.querySelector(".close-modal")
  
    if (openModalBtn && modal) {
      openModalBtn.addEventListener("click", () => {
        modal.classList.add("active")
        document.body.style.overflow = "hidden"
      })
  
      closeModal.addEventListener("click", () => {
        modal.classList.remove("active")
        document.body.style.overflow = ""
      })
  
      // Close modal when clicking outside
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active")
          document.body.style.overflow = ""
        }
      })
    }
  }
  
  // Form validation
  function initFormValidation() {
    const registrationForm = document.getElementById("registration-form")
  
    if (registrationForm) {
      registrationForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        let isValid = true
        const formInputs = registrationForm.querySelectorAll("input, select, textarea")
  
        formInputs.forEach((input) => {
          if (input.hasAttribute("required") && !input.value.trim()) {
            isValid = false
            input.classList.add("error")
          } else if (input.type === "email" && input.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailPattern.test(input.value)) {
              isValid = false
              input.classList.add("error")
            } else {
              input.classList.remove("error")
            }
          } else {
            input.classList.remove("error")
          }
        })
  
        if (isValid) {
          // Here you would normally send the form data to a server
          // For demo purposes, we'll just show a success message
          registrationForm.innerHTML = `
                      <div class="success-message">
                          <i class="fas fa-check-circle"></i>
                          <h3>¡Inscripción Exitosa!</h3>
                          <p>Gracias por registrarte. Nos pondremos en contacto contigo pronto.</p>
                      </div>
                  `
  
          // Close modal after 3 seconds
          setTimeout(() => {
            const modal = document.getElementById("registration-modal")
            modal.classList.remove("active")
            document.body.style.overflow = ""
          }, 3000)
        }
      })
  
      // Remove error class on input
      const formInputs = registrationForm.querySelectorAll("input, select, textarea")
      formInputs.forEach((input) => {
        input.addEventListener("input", function () {
          this.classList.remove("error")
        })
      })
    }
  }
  
  // Dark mode toggle
  function toggleDarkMode() {
    if (document.body.getAttribute("data-theme") === "dark") {
      document.body.removeAttribute("data-theme")
      localStorage.setItem("theme", "light")
    } else {
      document.body.setAttribute("data-theme", "dark")
      localStorage.setItem("theme", "dark")
    }
  }
  
  // Dummy function for startCounting
  function startCounting() {
    // Replace this with your actual startCounting implementation
    console.log("startCounting function called")
  }
  // Función para cargar noticias desde JSON
async function cargarNoticias() {
  try {
    const response = await fetch("noticias.json")
    const data = await response.json()
    const noticias = data.noticias.filter((noticia) => noticia.estado === "publicada").slice(0, 3)

    const noticiasContainer = document.getElementById("noticias-container")
    if (noticiasContainer && noticias.length > 0) {
      noticiasContainer.innerHTML = ""

      noticias.forEach((noticia) => {
        const fecha = new Date(noticia.fecha)
        const dia = fecha.getDate().toString().padStart(2, "0")
        const mes = fecha.toLocaleDateString("es-ES", { month: "short" }).toUpperCase()

        const noticiaHTML = `
                    <div class="news-card">
                        <div class="news-image">
                            <img src="${noticia.imagen}" alt="${noticia.titulo}">
                            <div class="news-date">
                                <span class="day">${dia}</span>
                                <span class="month">${mes}</span>
                            </div>
                        </div>
                        <div class="news-content">
                            <h3>${noticia.titulo}</h3>
                            <p>${noticia.resumen}</p>
                            <a href="comunicacion.html" class="read-more">Leer más <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                `

        noticiasContainer.innerHTML += noticiaHTML
      })
    }
  } catch (error) {
    console.error("Error al cargar noticias:", error)
  }
}