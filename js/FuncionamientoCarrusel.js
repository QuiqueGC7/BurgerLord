document.addEventListener('DOMContentLoaded', function() {
    // Variables para el carrusel
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
  
    // Función para mostrar un slide específico
    function showSlide(index) {
      // Ocultar todos los slides
      slides.forEach(slide => {
        slide.classList.remove('active');
      });
  
      // Ajustar índice si está fuera de rango
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
  
      // Mostrar el slide actual
      slides[currentIndex].classList.add('active');
    }
  
    // Event listeners para botones
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
    });
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
    });
  
    // Se ha eliminado el setInterval que hacía avanzar automáticamente
  });