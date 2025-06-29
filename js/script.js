// Preloader
window.addEventListener('load', function() {
    const progressBar = document.getElementById('progress-bar');
    const preloader = document.querySelector('.preloader');
    
    // Simular progreso de carga
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        progressBar.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800);
            }, 500);
        }
    }, 200);
});

// Tema oscuro/claro
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Verificar tema guardado o preferencia del sistema
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Establecer tema inicial
const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
html.setAttribute('data-theme', currentTheme);

// Actualizar icono según el tema inicial
updateThemeIcon(currentTheme);

// Función para actualizar el icono del tema
function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Alternar tema
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Menú móvil
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Cambiar clase activa en navbar al desplazarse
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Resaltar sección actual
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY + 100;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const id = section.getAttribute('id');
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Filtro de proyectos
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Cambiar botón activo
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filtrar proyectos
        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Animación de habilidades al entrar en la sección
const aboutSection = document.getElementById('about');
const skillBars = document.querySelectorAll('.skill-progress');
let skillsAnimated = false;

window.addEventListener('scroll', () => {
    const sectionTop = aboutSection.offsetTop;
    const sectionHeight = aboutSection.clientHeight;
    const scrollPosition = window.scrollY + window.innerHeight;
    
    if (scrollPosition > sectionTop + sectionHeight / 2 && !skillsAnimated) {
        skillBars.forEach(bar => {
            const width = bar.parentElement.previousElementSibling.querySelector('.skill-percent').textContent;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
        skillsAnimated = true;
    }
});

// Formulario de contacto con Formspree
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validación adicional del formulario
            if (!this.checkValidity()) {
                showNotification('Por favor completa todos los campos correctamente', 'error');
                return;
            }
            
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: new FormData(this),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showNotification('✅ Mensaje enviado con éxito. Te responderé pronto!', 'success');
                    this.reset();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'El servidor respondió con un error');
                }
            } catch (error) {
                console.error('Error en el envío:', error);
                showNotification(`❌ Error al enviar: ${error.message}`, 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Función mejorada de notificación
    function showNotification(message, type = 'success') {
        // Eliminar notificaciones previas
        const existingNotifs = document.querySelectorAll('.custom-notification');
        existingNotifs.forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        // Mostrar
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(100px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
});

// Mostrar notificación
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Efecto hover en tarjetas de servicio
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});