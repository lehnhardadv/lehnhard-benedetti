document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // LENIS SMOOTH SCROLL INITIALIZATION
  // ==========================================
  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      
      // Atualiza ScrollTrigger quando o Lenis roda o scroll
      lenis.on('scroll', ScrollTrigger.update);

      // Vincula a atualização do Lenis ao ticker do GSAP para sincronização perfeita
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // ==========================================
  // HERO & ENTRY EFFECTS (GSAP FADE-IN WITH FALLBACK)
  // ==========================================
  const heroContent = document.getElementById('hero-content');
  const typingTitle = document.getElementById('hero-title-typing');
  
  if (heroContent && typingTitle) {
    const line1 = typingTitle.querySelector('.line-1');
    const line2 = typingTitle.querySelector('.line-2');
    
    if (line1 && line2) {
      if (window.gsap) {
        // --- FLUXO GSAP (Animações de entrada fluidas e rápidas) ---
        document.body.classList.add('gsap-active');
        
        // Esconder elementos iniciais antes de animar
        gsap.set("#main-header", { y: -50, opacity: 0 });
        gsap.set(".hero-tagline", { y: -15, opacity: 0 });
        gsap.set(line1, { y: 15, opacity: 0 });
        gsap.set(line2, { y: 15, opacity: 0 });
        gsap.set(".hero-description", { y: 20, opacity: 0 });
        gsap.set(".hero-actions", { y: 20, opacity: 0 });
        gsap.set(".btn-primary", { scale: 0.9, opacity: 0 });
        gsap.set(".btn-secondary", { scale: 0.9, opacity: 0 });
        
        const tl = gsap.timeline();
        
        // 1. Entrada de Header e Tagline
        tl.to("#main-header", { y: 0, opacity: 1, duration: 0.8, ease: "power4.out", clearProps: "transform,opacity" })
          .to(".hero-tagline", { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", clearProps: "transform,opacity" }, "-=0.4");
        
        // 2. Animação de entrada por Fade-in/Slide-up das linhas do título (Staggered)
        tl.to(line1, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "transform,opacity" }, "-=0.3")
          .to(line2, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "transform,opacity" }, "-=0.55");
        
        // 3. Surgimento da Descrição (suave e rápida)
        tl.to(".hero-description", {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "transform,opacity"
        }, "-=0.45");
        
        // 4. Entrada Staggered dos botões (efeito de escala + mola suave "back.out")
        tl.to(".hero-actions", { y: 0, opacity: 1, duration: 0.1, clearProps: "transform,opacity" }, "-=0.4")
          .to(".btn-primary", { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)", clearProps: "transform,opacity,scale" }, "-=0.3")
          .to(".btn-secondary", { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)", clearProps: "transform,opacity,scale" }, "-=0.35");
          
      } else {
        // --- FALLBACK VANILLA JS (Caso GSAP falhe em carregar) ---
        heroContent.classList.add('typing-active');
        
        setTimeout(() => {
          heroContent.classList.remove('typing-active');
          heroContent.classList.add('typing-complete');
        }, 150);
      }
    }
  }

  // ==========================================
  // STICKY HEADER & SCROLL STATE
  // ==========================================
  const header = document.getElementById('main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check in case of page refresh mid-page

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking any menu link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ==========================================
  // HIGH PERFORMANCE SCROLL REVEAL (GSAP ScrollTrigger & Observer Fallback)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  if (window.gsap && window.ScrollTrigger) {
    // 1. Animação Staggered para os cards de serviços (Áreas de Domínio)
    gsap.fromTo(".service-card", 
      { opacity: 0, y: 50, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: {
          each: 0.12,
          onComplete: function() {
            // Adiciona 'revealed' ANTES de limpar props para evitar snap
            this.targets()[0].classList.add('revealed');
            gsap.set(this.targets()[0], { clearProps: "all" });
          }
        },
        ease: "back.out(1.4)"
      }
    );

    // 2. Animação Staggered para as estatísticas (Diferencial)
    // Revela o container pai imediatamente para que não interfira
    const statsContainer = document.querySelector('.why-stats');
    if (statsContainer) {
      statsContainer.classList.add('revealed');
      gsap.set(statsContainer, { clearProps: "all" });
    }
    gsap.fromTo(".stat-card",
      { opacity: 0, x: -30 },
      {
        scrollTrigger: {
          trigger: ".why-stats",
          start: "top 88%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: {
          each: 0.15,
          onComplete: function() {
            gsap.set(this.targets()[0], { clearProps: "all" });
          }
        },
        ease: "power2.out"
      }
    );

    // 3. Animações de entrada para a seção do Manifesto
    gsap.fromTo(".manifesto-video-wrapper",
      { opacity: 0, x: -50 },
      {
        scrollTrigger: {
          trigger: ".manifesto-grid",
          start: "top 82%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: "power3.out",
        onComplete: function() {
          this.targets().forEach(el => {
            el.classList.add('revealed');
            gsap.set(el, { clearProps: "all" });
          });
        }
      }
    );

    gsap.fromTo(".manifesto-info",
      { opacity: 0, x: 50 },
      {
        scrollTrigger: {
          trigger: ".manifesto-grid",
          start: "top 82%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: "power3.out",
        onComplete: function() {
          this.targets().forEach(el => {
            el.classList.add('revealed');
            gsap.set(el, { clearProps: "all" });
          });
        }
      }
    );

    // 4. Animação Geral para os outros elementos com classe .reveal
    const generalRevealElements = Array.from(revealElements).filter(el => {
      return !el.classList.contains('service-card') && 
             !el.classList.contains('stat-card') && 
             !el.classList.contains('manifesto-video-wrapper') && 
             !el.classList.contains('manifesto-info') &&
             !el.closest('.why-stats');
    });

    generalRevealElements.forEach(element => {
      let delay = 0;
      if (element.classList.contains('reveal-delay-1')) delay = 0.15;
      else if (element.classList.contains('reveal-delay-2')) delay = 0.3;
      else if (element.classList.contains('reveal-delay-3')) delay = 0.45;
      else if (element.classList.contains('reveal-delay-4')) delay = 0.6;
      
      gsap.fromTo(element,
        { opacity: 0, y: 35 },
        {
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            toggleActions: "play none none none"
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: delay,
          ease: "power2.out",
          onComplete: function() {
            this.targets().forEach(el => {
              el.classList.add('revealed');
              gsap.set(el, { clearProps: "all" });
            });
          }
        }
      );
    });

  } else {
    // --- FALLBACK INTERSECTION OBSERVER ---
    const revealOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, revealOptions);

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  }

  // ==========================================
  // DYNAMIC FORM VALIDATION & SUCCESS TOAST
  // ==========================================
  const leadForm = document.getElementById('lead-form');
  const successToast = document.getElementById('success-toast');

  const showToast = () => {
    successToast.classList.add('active');
    setTimeout(() => {
      successToast.classList.remove('active');
    }, 4500);
  };

  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const challengeInput = document.getElementById('form-challenge');
    
    let isValid = true;
    
    // Simple verification feedback
    [nameInput, emailInput, challengeInput].forEach(input => {
      if (!input.value.trim()) {
        input.style.borderBottomColor = '#ff6b6b';
        isValid = false;
      } else {
        input.style.borderBottomColor = '';
      }
    });

    // Email validation regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
      emailInput.style.borderBottomColor = '#ff6b6b';
      isValid = false;
    }

    if (isValid) {
      // Simulate sending lead data securely to lawyer CRM backend
      console.log('Sending secure client message details...', {
        name: nameInput.value,
        company: document.getElementById('form-company').value,
        email: emailInput.value,
        challenge: challengeInput.value
      });

      // Show luxury alert toast
      showToast();
      
      // Reset form
      leadForm.reset();
      
      // Reset active label classes by resetting input value attributes
      const inputs = leadForm.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.style.borderBottomColor = '';
      });
    }
  });

  // Dynamic feedback: reset red border bottom on input type
  const formInputs = leadForm.querySelectorAll('.form-input');
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      input.style.borderBottomColor = '';
    });
  });

  // ==========================================
  // SMOOTH SCROLL LINK INTERCEPTOR (LENIS COMPATIBLE)
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        if (lenis) {
          // Deslocamento de -70px para compensar o header fixo/sticky
          lenis.scrollTo(targetElement, {
            offset: -70,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }

        // Update the URL hash without scrolling/jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // Inactive links helper
  document.querySelectorAll('.inactive-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert("Aviso: Esta funcionalidade do blog/atendimento simulado é um demonstrativo visual e não está ativa nesta demonstração estática.");
    });
  });
});
