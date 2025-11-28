// Appointments Data
const appointments = [
  {
    id: 1,
    name: 'Cornrows',
    duration: 50,
    price: 45.00,
    description: 'Cornrows Style',
    imageUrls: [
      'https://res.cloudinary.com/dgjlnqft1/image/upload/v1762987044/1_Detailed-Black-Lemonade_frjfh1.jpg',
      'https://picsum.photos/seed/cornrows2/400/400',
      'https://picsum.photos/seed/cornrows3/400/400',
    ]
  },
  {
    id: 2,
    name: 'Angela',
    duration: 30,
    price: 55.00,
    description: 'Angela Style',
    imageUrls: [
      'https://res.cloudinary.com/dgjlnqft1/image/upload/v1762987045/2_Black-Micro-Cornrows-and-Long-Wavy_uiujeh.jpg',
      'https://picsum.photos/seed/cornrows2/400/400',
      'https://picsum.photos/seed/cornrows3/400/400',
    ]
  },
  {
    id: 3,
    name: 'Box Braids',
    duration: 180,
    price: 150.00,
    description: 'Classic box braids, medium size',
    imageUrls: [
      'https://res.cloudinary.com/dgjlnqft1/image/upload/v1762987045/3_Upswept-Black_ndjeab.jpg',
      'https://picsum.photos/seed/boxbraids2/400/400',
    ]
  },
  {
    id: 4,
    name: 'Silk Press',
    duration: 90,
    price: 85.00,
    description: 'Natural hair straightened to a silky finish',
    imageUrls: ['https://res.cloudinary.com/dgjlnqft1/image/upload/v1762987045/4_Long-Curly-Hairstyle_s1sqs5.jpg']
  },
  {
    id: 5,
    name: 'Wash & Set',
    duration: 60,
    price: 60.00,
    description: 'Deep conditioning wash and roller set',
    imageUrls: ['https://res.cloudinary.com/dgjlnqft1/image/upload/v1762987045/3_Upswept-Black_ndjeab.jpg']
  },
  {
    id: 6,
    name: 'Wash',
    duration: 60,
    price: 60.00,
    description: 'Deep conditioning wash and roller set',
    imageUrls: ['https://res.cloudinary.com/dgjlnqft1/image/upload/v1762987045/5_Swoopy-Black-Cornrows_nse6tf.jpg']
  }
];

// IMPORTANT: Replace this with your actual email address
const YOUR_EMAIL_ADDRESS = 'your-email@example.com';

// IMPORTANT: Replace this with your actual Google Calendar booking link
const GOOGLE_CALENDAR_LINK = 'https://calendar.google.com/calendar/selfsched/...';

// ADMIN: Block out specific time slots here.
// This is a simple way to manage availability without a backend.
// Format: 'YYYY-MM-DD': ['HH:MM', 'HH:MM']
const unavailableSlots = {
  '2024-10-28': ['10:00', '10:30', '14:00'], // Example for Oct 28th
  '2024-10-29': ['11:00'],                   // Example for Oct 29th
};

// State Management
let modalState = {
  isOpen: false,
  images: [],
  currentIndex: 0
};

let bookingChoiceAppointment = null;
let bookingModalAppointment = null;

// Helper Functions
function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateTimeSlots(start, end, interval) {
  const slots = [];
  let currentTime = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);

  while (currentTime <= endTime) {
    slots.push(currentTime.toTimeString().substring(0, 5));
    currentTime.setMinutes(currentTime.getMinutes() + interval);
  }
  return slots;
}

// Image Modal Functions
function openImageModal(images, index) {
  modalState = {
    isOpen: true,
    images: images,
    currentIndex: index
  };
  updateImageModal();
}

function closeImageModal() {
  modalState = {
    isOpen: false,
    images: [],
    currentIndex: 0
  };
  updateImageModal();
}

function nextImage() {
  if (modalState.images.length > 0) {
    modalState.currentIndex = (modalState.currentIndex + 1) % modalState.images.length;
    updateImageModal();
  }
}

function prevImage() {
  if (modalState.images.length > 0) {
    modalState.currentIndex = (modalState.currentIndex - 1 + modalState.images.length) % modalState.images.length;
    updateImageModal();
  }
}

function updateImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const prevBtn = document.getElementById('prevImageBtn');
  const nextBtn = document.getElementById('nextImageBtn');

  if (modalState.isOpen) {
    modal.classList.remove('hidden');
    modalImage.src = modalState.images[modalState.currentIndex];
    modalImage.alt = `View ${modalState.currentIndex + 1} of ${modalState.images.length}`;
    
    if (modalState.images.length > 1) {
      prevBtn.classList.remove('hidden');
      nextBtn.classList.remove('hidden');
    } else {
      prevBtn.classList.add('hidden');
      nextBtn.classList.add('hidden');
    }
  } else {
    modal.classList.add('hidden');
  }
}

// Booking Choice Modal Functions
function openBookingChoiceModal(appointment) {
  bookingChoiceAppointment = appointment;
  const modal = document.getElementById('bookingChoiceModal');
  const serviceName = document.getElementById('bookingChoiceServiceName');
  serviceName.textContent = appointment.name;
  modal.classList.remove('hidden');
}

function closeBookingChoiceModal() {
  bookingChoiceAppointment = null;
  const modal = document.getElementById('bookingChoiceModal');
  modal.classList.add('hidden');
}

function selectEmailBooking() {
  if (bookingChoiceAppointment) {
    bookingModalAppointment = bookingChoiceAppointment;
    closeBookingChoiceModal();
    openBookingModal();
  }
}

function selectCalendarBooking() {
  window.open(GOOGLE_CALENDAR_LINK, '_blank');
  closeBookingChoiceModal();
}

// Booking Modal Functions
function openBookingModal() {
  const modal = document.getElementById('bookingModal');
  const serviceName = document.getElementById('bookingServiceName');
  const dateInput = document.getElementById('date');
  
  if (bookingModalAppointment) {
    serviceName.textContent = bookingModalAppointment.name;
    dateInput.min = getTodayString();
    updateTimeSlots();
    modal.classList.remove('hidden');
  }
}

function closeBookingModal() {
  bookingModalAppointment = null;
  const modal = document.getElementById('bookingModal');
  const form = document.getElementById('bookingForm');
  form.reset();
  modal.classList.add('hidden');
}

function updateTimeSlots() {
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  const selectedDate = dateInput.value;
  
  // Clear existing options
  timeSelect.innerHTML = '<option value="" disabled>Select a time</option>';
  
  if (!selectedDate) {
    timeSelect.disabled = true;
    return;
  }
  
  timeSelect.disabled = false;
  const timeSlots = generateTimeSlots('09:00', '17:00', 30);
  const bookedTimes = unavailableSlots[selectedDate] || [];
  
  timeSlots.forEach(slot => {
    const option = document.createElement('option');
    option.value = slot;
    option.textContent = slot + (bookedTimes.includes(slot) ? ' (Unavailable)' : '');
    option.disabled = bookedTimes.includes(slot);
    timeSelect.appendChild(option);
  });
}

function handleBookingSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const phone = formData.get('phone');
  const email = formData.get('email') || '';
  const date = formData.get('date');
  const time = formData.get('time');
  const notes = formData.get('notes') || '';
  
  if (!name || !phone || !date || !time) {
    alert('Please fill in all required fields: Name, Phone, Date, and Time.');
    return;
  }
  
  const subject = `New Booking Request: ${bookingModalAppointment.name} on ${date}`;
  const body = `
    A new booking request has been submitted. Please contact the client to confirm.
    
    --------------------------------
    Service: ${bookingModalAppointment.name}
    Client Name: ${name}
    Phone: ${phone}
    Email: ${email || 'Not provided'}
    
    Requested Date: ${date}
    Requested Time: ${time}
    --------------------------------

    Notes from client:
    ${notes || 'No notes provided.'}
  `;

  const mailtoLink = `mailto:${YOUR_EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  window.location.href = mailtoLink;

  closeBookingModal();
}

// Render Appointment Items
function renderAppointmentItem(appointment) {
  const container = document.createElement('div');
  container.className = 'bg-primary-bg p-4 sm:p-6 border border-border-color flex items-center space-x-4 sm:space-x-6';
  
  let currentImageIndex = 0;
  const imageContainer = document.createElement('div');
  imageContainer.className = 'flex-shrink-0 relative group cursor-pointer appointment-item-image-container';
  
  const img = document.createElement('img');
  img.src = appointment.imageUrls[currentImageIndex];
  img.alt = appointment.name;
  img.className = 'w-36 h-36 md:w-48 md:h-48 object-cover';
  
  const overlay = document.createElement('div');
  overlay.className = 'absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center appointment-item-overlay';
  
  const magnifier = document.createElement('div');
  magnifier.className = 'opacity-0 group-hover:opacity-100 transition-opacity duration-300 appointment-item-magnifier';
  magnifier.innerHTML = `
    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3h-6" />
    </svg>
  `;
  
  overlay.appendChild(magnifier);
  
  imageContainer.appendChild(img);
  imageContainer.appendChild(overlay);
  
  // Add navigation arrows if multiple images
  if (appointment.imageUrls.length > 1) {
    const prevArrow = document.createElement('button');
    prevArrow.className = 'appointment-item-nav-arrow left';
    prevArrow.setAttribute('aria-label', 'Previous Image');
    prevArrow.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    `;
    
    const nextArrow = document.createElement('button');
    nextArrow.className = 'appointment-item-nav-arrow right';
    nextArrow.setAttribute('aria-label', 'Next Image');
    nextArrow.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    `;
    
    prevArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex - 1 + appointment.imageUrls.length) % appointment.imageUrls.length;
      img.src = appointment.imageUrls[currentImageIndex];
    });
    
    nextArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex + 1) % appointment.imageUrls.length;
      img.src = appointment.imageUrls[currentImageIndex];
    });
    
    imageContainer.appendChild(prevArrow);
    imageContainer.appendChild(nextArrow);
  }
  
  imageContainer.addEventListener('click', () => {
    openImageModal(appointment.imageUrls, currentImageIndex);
  });
  
  const content = document.createElement('div');
  content.className = 'flex-grow';
  
  const title = document.createElement('h3');
  title.className = 'font-bold text-base md:text-lg';
  title.textContent = appointment.name;
  
  const price = document.createElement('p');
  price.className = 'text-sm md:text-base text-text-secondary';
  price.textContent = `${appointment.duration} minutes @ $${appointment.price.toFixed(2)}`;
  
  const description = document.createElement('p');
  description.className = 'text-sm md:text-base mt-2';
  description.textContent = appointment.description;
  
  content.appendChild(title);
  content.appendChild(price);
  content.appendChild(description);
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex-shrink-0';
  
  const bookButton = document.createElement('button');
  bookButton.className = 'book-button bg-accent text-text-on-accent text-base font-bold py-4 px-10 rounded-lg hover:bg-accent-hover transition-all';
  bookButton.textContent = 'BOOK';
  bookButton.setAttribute('aria-label', `Book appointment for ${appointment.name}`);
  bookButton.addEventListener('click', () => openBookingChoiceModal(appointment));
  
  buttonContainer.appendChild(bookButton);
  
  container.appendChild(imageContainer);
  container.appendChild(content);
  container.appendChild(buttonContainer);
  
  return container;
}

function renderAppointments() {
  const appointmentList = document.getElementById('appointmentList');
  appointmentList.innerHTML = '';
  
  appointments.forEach(appointment => {
    const item = renderAppointmentItem(appointment);
    appointmentList.appendChild(item);
  });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Render appointments
  renderAppointments();
  
  // Image Modal
  const imageModal = document.getElementById('imageModal');
  const closeImageModalBtn = document.getElementById('closeImageModalBtn');
  const prevImageBtn = document.getElementById('prevImageBtn');
  const nextImageBtn = document.getElementById('nextImageBtn');
  
  imageModal.addEventListener('click', (e) => {
    // Close modal when clicking on the background (dark overlay)
    // But not when clicking on the image, buttons, or content container
    if (e.target === imageModal) {
      closeImageModal();
    }
  });
  
  // Prevent closing when clicking on the image or content container
  const imageModalContent = document.getElementById('imageModalContent');
  if (imageModalContent) {
    imageModalContent.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  closeImageModalBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeImageModal();
  });
  
  // Prevent closing when clicking on the image itself
  const modalImage = document.getElementById('modalImage');
  if (modalImage) {
    modalImage.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  prevImageBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prevImage();
  });
  nextImageBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextImage();
  });
  
  // Keyboard navigation for image modal
  document.addEventListener('keydown', (e) => {
    if (modalState.isOpen) {
      if (e.key === 'Escape') {
        closeImageModal();
      } else if (e.key === 'ArrowRight' && modalState.images.length > 1) {
        nextImage();
      } else if (e.key === 'ArrowLeft' && modalState.images.length > 1) {
        prevImage();
      }
    }
  });
  
  // Booking Choice Modal
  const bookingChoiceModal = document.getElementById('bookingChoiceModal');
  const closeBookingChoiceModalBtn = document.getElementById('closeBookingChoiceModalBtn');
  const emailBookingBtn = document.getElementById('emailBookingBtn');
  const calendarBookingBtn = document.getElementById('calendarBookingBtn');
  
  bookingChoiceModal.addEventListener('click', (e) => {
    if (e.target === bookingChoiceModal) {
      closeBookingChoiceModal();
    }
  });
  
  closeBookingChoiceModalBtn.addEventListener('click', closeBookingChoiceModal);
  emailBookingBtn.addEventListener('click', selectEmailBooking);
  calendarBookingBtn.addEventListener('click', selectCalendarBooking);
  
  // Booking Modal
  const bookingModal = document.getElementById('bookingModal');
  const closeBookingModalBtn = document.getElementById('closeBookingModalBtn');
  const bookingForm = document.getElementById('bookingForm');
  const dateInput = document.getElementById('date');
  
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      closeBookingModal();
    }
  });
  
  closeBookingModalBtn.addEventListener('click', closeBookingModal);
  bookingForm.addEventListener('submit', handleBookingSubmit);
  
  dateInput.addEventListener('change', () => {
    const timeSelect = document.getElementById('time');
    timeSelect.value = '';
    updateTimeSlots();
  });
});

