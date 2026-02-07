/* =========================================
   1. MENU HAMBURGUESA & TYPEWRITER
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- MENÚ HAMBURGUESA ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // --- INICIAR EFECTO DE ESCRITURA ---
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }
    
    // --- CONECTAR EL FORMULARIO (AJAX) ---
    // Ponemos esto aquí adentro para asegurar que el HTML ya existe
    initContactForm();
});

/* =========================================
   2. CLASE TYPEWRITER
   ========================================= */
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if(this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if(this.isDeleting) {
            typeSpeed /= 2;
        }

        if(!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

/* =========================================
   3. OCULTAR INDICADOR DE SCROLL
   ========================================= */
window.addEventListener('scroll', () => {
    const wrapper = document.querySelector('.scroll-wrapper');
    if (wrapper) {
        if (window.scrollY > (window.innerHeight * 0.2)) {
            wrapper.classList.add('fade-out');
        } else {
            wrapper.classList.remove('fade-out');
        }
    }
});

/* =========================================
   4. FUNCIÓN DEL FORMULARIO AJAX
   ========================================= */
function initContactForm() {
    const form = document.getElementById("contact-form");
    
    // Si no encuentra el form, salimos para no dar error
    if (!form) return; 

    console.log("✅ Formulario detectado y listo.");

    async function handleSubmit(event) {
        event.preventDefault(); // ¡ESTO EVITA LA RECARGA!
        
        const status = document.getElementById("form-status");
        const btn = form.querySelector('.btn-animated');
        const btnTextOriginal = btn.innerText;

        // Feedback visual
        btn.innerText = "Enviando...";
        btn.style.opacity = "0.7";
        btn.disabled = true;

        const data = new FormData(event.target);

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                status.innerHTML = "¡Recibido! Nos pondremos en contacto pronto.";
                status.style.display = "block";
                status.style.color = "#3b82f6";
                form.reset();
                btn.innerText = "Enviado ✓";
                
                setTimeout(() => {
                    btn.innerText = btnTextOriginal;
                    btn.disabled = false;
                    btn.style.opacity = "1";
                }, 3000);
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.innerHTML = "Hubo un problema al enviar.";
                    }
                    status.style.display = "block";
                    status.style.color = "red";
                    btn.innerText = btnTextOriginal;
                    btn.disabled = false;
                })
            }
        }).catch(error => {
            status.innerHTML = "Error de conexión. Revisa tu internet.";
            status.style.display = "block";
            status.style.color = "red";
            btn.innerText = btnTextOriginal;
            btn.disabled = false;
        });
    }

    form.addEventListener("submit", handleSubmit);
}