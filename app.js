/**
 * Lumina Dental Studio - Interactive Scripts
 * TSCG Demo Website 4 (Dental Clinic Portfolio)
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initServiceFilter();
  initFaqAccordion();
  initScrollSpy();
  initAppointmentForm();
});

/* ==========================================================================
   1. Sticky Header Shadow
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run on load and on scroll
  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

/* ==========================================================================
   2. Mobile Navigation Menu
   ========================================================================== */
function initMobileNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !navMenu) return;

  // Toggle open class on burger click
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== navToggle) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   3. Service Filtering Tabs
   ========================================================================== */
function initServiceFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (filterButtons.length === 0 || serviceCards.length === 0) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes on tab buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter cards
      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Simple visual trigger for animation restart
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   4. FAQ Accordion Logic
   ========================================================================== */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  if (faqQuestions.length === 0) return;

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const faqAnswer = question.nextElementSibling;
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      // Close all other accordion items first
      faqQuestions.forEach(otherQuestion => {
        if (otherQuestion !== question) {
          otherQuestion.setAttribute('aria-expanded', 'false');
          const otherAnswer = otherQuestion.nextElementSibling;
          otherAnswer.style.maxHeight = '0';
        }
      });

      // Toggle current accordion item
      if (isExpanded) {
        question.setAttribute('aria-expanded', 'false');
        faqAnswer.style.maxHeight = '0';
      } else {
        question.setAttribute('aria-expanded', 'true');
        // Set dynamic maxHeight based on content scrollHeight
        faqAnswer.style.maxHeight = `${faqAnswer.scrollHeight}px`;
      }
    });
  });

  // Recalculate expanded accordion max-heights on window resize
  window.addEventListener('resize', () => {
    const activeAnswer = document.querySelector('.faq-question[aria-expanded="true"] + .faq-answer');
    if (activeAnswer) {
      activeAnswer.style.maxHeight = `${activeAnswer.scrollHeight}px`;
    }
  });
}

/* ==========================================================================
   5. ScrollSpy (Header Nav Highlighting on Scroll)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the active middle portion
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   6. Appointment Form Validation & Modal Logic
   ========================================================================== */
function initAppointmentForm() {
  const form = document.getElementById('appointment-form');
  const modal = document.getElementById('success-modal');
  
  if (!form || !modal) return;

  // Set min date for the calendar to tomorrow (avoid booking past or same day slots in real-time demo)
  const dateInput = document.getElementById('appointment-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    dateInput.min = `${year}-${month}-${day}`;
  }

  // Real-time formatting for phone input: (123) 456-7890
  const phoneInput = document.getElementById('phone-number');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
  }

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isFormValid = validateForm(form);

    if (isFormValid) {
      // Collect summary data
      const name = document.getElementById('full-name').value.trim();
      const service = document.getElementById('service-select').value;
      const doctor = document.getElementById('doctor-select').value;
      const dateVal = document.getElementById('appointment-date').value;
      const timeVal = document.getElementById('appointment-time').value;
      const phone = document.getElementById('phone-number').value.trim();

      // Format date for readable display: e.g. July 15, 2026
      const dateObj = new Date(dateVal + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Populate Success Modal Details
      document.getElementById('summary-name').textContent = name;
      document.getElementById('summary-service').textContent = service;
      document.getElementById('summary-doctor').textContent = doctor;
      document.getElementById('summary-datetime').textContent = `${formattedDate} at ${timeVal}`;
      document.getElementById('summary-phone').textContent = phone;

      // Open Modal
      openModal(modal);

      // Reset form fields
      form.reset();
      
      // Clean active validation classes
      const formGroups = form.querySelectorAll('.form-group');
      formGroups.forEach(group => group.classList.remove('invalid'));
    }
  });

  // Modal Close Elements
  const closeBtnX = document.getElementById('modal-close');
  const closeBtnDone = document.getElementById('modal-close-btn');

  const closeActions = [closeBtnX, closeBtnDone];
  closeActions.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        closeModal(modal);
      });
    }
  });

  // Close modal on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal(modal);
    }
  });
}

/**
 * Validates individual form controls
 * @param {HTMLFormElement} form
 * @returns {boolean} True if all controls are valid
 */
function validateForm(form) {
  let isValid = true;

  // 1. Full Name Validation
  const nameInput = document.getElementById('full-name');
  if (nameInput) {
    const value = nameInput.value.trim();
    if (value.length < 2) {
      setFieldError(nameInput, true);
      isValid = false;
    } else {
      setFieldError(nameInput, false);
    }
  }

  // 2. Email Validation
  const emailInput = document.getElementById('email-address');
  if (emailInput) {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setFieldError(emailInput, true);
      isValid = false;
    } else {
      setFieldError(emailInput, false);
    }
  }

  // 3. Phone Number Validation
  const phoneInput = document.getElementById('phone-number');
  if (phoneInput) {
    // Strip everything except digits to check if there are exactly 10 digits
    const digits = phoneInput.value.replace(/\D/g, '');
    if (digits.length !== 10) {
      setFieldError(phoneInput, true);
      isValid = false;
    } else {
      setFieldError(phoneInput, false);
    }
  }

  // 4. Service Selection
  const serviceSelect = document.getElementById('service-select');
  if (serviceSelect) {
    if (serviceSelect.value === '') {
      setFieldError(serviceSelect, true);
      isValid = false;
    } else {
      setFieldError(serviceSelect, false);
    }
  }

  // 5. Doctor Selection
  const doctorSelect = document.getElementById('doctor-select');
  if (doctorSelect) {
    if (doctorSelect.value === '') {
      setFieldError(doctorSelect, true);
      isValid = false;
    } else {
      setFieldError(doctorSelect, false);
    }
  }

  // 6. Appointment Date
  const dateInput = document.getElementById('appointment-date');
  if (dateInput) {
    const dateVal = dateInput.value;
    if (!dateVal) {
      setFieldError(dateInput, true);
      isValid = false;
    } else {
      const selectedDate = new Date(dateVal + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Selected date must be tomorrow or later
      if (selectedDate <= today) {
        setFieldError(dateInput, true);
        isValid = false;
      } else {
        setFieldError(dateInput, false);
      }
    }
  }

  // 7. Time Slot Selection
  const timeSelect = document.getElementById('appointment-time');
  if (timeSelect) {
    if (timeSelect.value === '') {
      setFieldError(timeSelect, true);
      isValid = false;
    } else {
      setFieldError(timeSelect, false);
    }
  }

  return isValid;
}

/**
 * Sets error class on form field parent
 * @param {HTMLElement} inputField 
 * @param {boolean} hasError 
 */
function setFieldError(inputField, hasError) {
  const formGroup = inputField.closest('.form-group');
  if (!formGroup) return;

  if (hasError) {
    formGroup.classList.add('invalid');
  } else {
    formGroup.classList.remove('invalid');
  }
}

/* Modal Open/Close helpers */
function openModal(modalEl) {
  modalEl.classList.add('open');
  document.body.style.overflow = 'hidden'; // Stop background scrolling
  
  // Shift focus to close button for accessibility
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeModal(modalEl) {
  modalEl.classList.remove('open');
  document.body.style.overflow = ''; // Restore background scrolling
}
