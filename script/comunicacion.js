// JavaScript para comunicacion.html

document.addEventListener("DOMContentLoaded", () => {
  inicializarNavegacion()
  inicializarModoOscuro()
  cargarTodasLasNoticias()
  inicializarFiltros()
  inicializarPaginacion()
  inicializarNewsletter()
})

let todasLasNoticias = []
let noticiasFiltradas = []
let paginaActual = 1
const noticiasPorPagina = 6

function inicializarNavegacion() {
  const menuToggle = document.querySelector(".menu-toggle")
  const menu = document.querySelector(".menu")
  const hasSubmenuItems = document.querySelectorAll(".has-submenu")

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      this.classList.toggle("active")
      menu.classList.toggle("active")
      document.body.classList.toggle("menu-open")
    })
  }

  hasSubmenuItems.forEach((item) => {
    const link = item.querySelector("a")

    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault()
        item.classList.toggle("active")
      }
    })
  })

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !menuToggle.contains(e.target) && menu.classList.contains("active")) {
      menu.classList.remove("active")
      menuToggle.classList.remove("active")
      document.body.classList.remove("menu-open")
    }
  })
}

function inicializarModoOscuro() {
  const darkModeToggle = document.getElementById("darkmode-toggle")

  if (darkModeToggle) {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.body.setAttribute("data-theme", "dark")
      darkModeToggle.checked = true
    }

    darkModeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.setAttribute("data-theme", "dark")
        localStorage.setItem("theme", "dark")
      } else {
        document.body.removeAttribute("data-theme")
        localStorage.setItem("theme", "light")
      }
    })
  }
}

async function cargarTodasLasNoticias() {
  try {
    const response = await fetch("eventos.json")
    const data = await response.json()
    todasLasNoticias = data.eventos.filter((evento) => evento.estado === "publicado")
    noticiasFiltradas = [...todasLasNoticias]
    mostrarNoticias()
    actualizarPaginacion()
  } catch (error) {
    console.error("Error al cargar noticias:", error)
    mostrarErrorNoticias()
  }
}

function inicializarFiltros() {
  const filterBtns = document.querySelectorAll(".filter-btn")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remover clase active de todos los botones
      filterBtns.forEach((b) => b.classList.remove("active"))
      // Agregar clase active al botón clickeado
      this.classList.add("active")

      const filtro = this.dataset.filter
      filtrarNoticias(filtro)
    })
  })
}

function filtrarNoticias(categoria) {
  if (categoria === "todas") {
    noticiasFiltradas = [...todasLasNoticias]
  } else {
    noticiasFiltradas = todasLasNoticias.filter((noticia) => noticia.categoria === categoria)
  }

  paginaActual = 1
  mostrarNoticias()
  actualizarPaginacion()
}

function mostrarNoticias() {
  const noticiasContainer = document.getElementById("todas-noticias")
  if (!noticiasContainer) return

  const inicio = (paginaActual - 1) * noticiasPorPagina
  const fin = inicio + noticiasPorPagina
  const noticiasAPaginar = noticiasFiltradas.slice(inicio, fin)

  if (noticiasAPaginar.length === 0) {
    noticiasContainer.innerHTML = '<p class="text-center">No se encontraron noticias.</p>'
    return
  }

  noticiasContainer.innerHTML = ""

  noticiasAPaginar.forEach((noticia) => {
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
                    <div class="news-meta">
                        <span class="news-category">${obtenerNombreCategoria(noticia.categoria)}</span>
                        <span class="news-author">Por ${noticia.autor}</span>
                    </div>
                    <button class="read-more" onclick="mostrarNoticiaCompleta(${noticia.id})">
                        Leer más <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `

    noticiasContainer.innerHTML += noticiaHTML
  })
}

function obtenerNombreCategoria(categoria) {
  const categorias = {
    competencias: "Competencias",
    entrenamientos: "Entrenamientos",
    eventos: "Eventos",
    general: "General",
  }
  return categorias[categoria] || categoria
}

function mostrarNoticiaCompleta(id) {
  const noticia = todasLasNoticias.find((n) => n.id === id)
  if (!noticia) return

  // Crear modal para mostrar noticia completa
  const modal = document.createElement("div")
  modal.className = "modal active"
  modal.innerHTML = `
        <div class="modal-content modal-large">
            <span class="close-modal">&times;</span>
            <div class="news-full">
                <img src="${noticia.imagen}" alt="${noticia.titulo}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">
                <h1>${noticia.titulo}</h1>
                <div class="news-meta" style="margin-bottom: 20px; color: var(--text-light);">
                    <span>Por ${noticia.autor}</span> • 
                    <span>${new Date(noticia.fecha).toLocaleDateString("es-ES")}</span> • 
                    <span>${obtenerNombreCategoria(noticia.categoria)}</span>
                </div>
                <div class="news-content-full" style="line-height: 1.8;">
                    ${noticia.contenido.replace(/\n/g, "<br><br>")}
                </div>
            </div>
        </div>
    `

  document.body.appendChild(modal)
  document.body.style.overflow = "hidden"

  // Cerrar modal
  const closeBtn = modal.querySelector(".close-modal")
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(modal)
    document.body.style.overflow = ""
  })

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal)
      document.body.style.overflow = ""
    }
  })
}

function inicializarPaginacion() {
  const prevBtn = document.getElementById("prev-page")
  const nextBtn = document.getElementById("next-page")

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (paginaActual > 1) {
        paginaActual--
        mostrarNoticias()
        actualizarPaginacion()
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const totalPaginas = Math.ceil(noticiasFiltradas.length / noticiasPorPagina)
      if (paginaActual < totalPaginas) {
        paginaActual++
        mostrarNoticias()
        actualizarPaginacion()
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })
  }
}

function actualizarPaginacion() {
  const totalPaginas = Math.ceil(noticiasFiltradas.length / noticiasPorPagina)
  const currentPageSpan = document.getElementById("current-page")
  const totalPagesSpan = document.getElementById("total-pages")
  const prevBtn = document.getElementById("prev-page")
  const nextBtn = document.getElementById("next-page")

  if (currentPageSpan) currentPageSpan.textContent = paginaActual
  if (totalPagesSpan) totalPagesSpan.textContent = totalPaginas

  if (prevBtn) {
    prevBtn.disabled = paginaActual === 1
  }

  if (nextBtn) {
    nextBtn.disabled = paginaActual === totalPaginas
  }
}

function inicializarNewsletter() {
  const newsletterForm = document.getElementById("newsletter-form")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const email = this.querySelector('input[type="email"]').value

      // Simular suscripción exitosa
      this.innerHTML = `
                <div class="success-message" style="color: var(--primary-color); text-align: center;">
                    <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>¡Suscripción exitosa! Gracias por unirte a nuestro boletín.</p>
                </div>
            `

      setTimeout(() => {
        this.innerHTML = `
                    <input type="email" placeholder="Tu correo electrónico" required>
                    <button type="submit" class="btn">Suscribirse</button>
                `
      }, 3000)
    })
  }
}

function mostrarErrorNoticias() {
  const noticiasContainer = document.getElementById("todas-noticias")
  if (noticiasContainer) {
    noticiasContainer.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b00; margin-bottom: 20px;"></i>
                <h3>Error al cargar noticias</h3>
                <p>No se pudieron cargar las noticias. Por favor, intenta más tarde.</p>
            </div>
        `
  }
}
