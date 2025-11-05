// Image data with categories - using reliable placeholder images
const images = [
    // Nature (6 images)
    { src: 'https://picsum.photos/800/600?random=1', alt: 'Beautiful landscape', category: 'nature', caption: 'Serene Mountain View' },
    { src: 'https://picsum.photos/800/600?random=2', alt: 'Forest path', category: 'nature', caption: 'Mystical Forest Trail' },
    { src: 'https://picsum.photos/800/600?random=3', alt: 'Ocean view', category: 'nature', caption: 'Tranquil Ocean Sunset' },
    { src: 'https://picsum.photos/800/600?random=4', alt: 'Desert landscape', category: 'nature', caption: 'Vast Desert Sands' },
    { src: 'https://picsum.photos/800/600?random=5', alt: 'Waterfall', category: 'nature', caption: 'Cascading Waterfall' },
    { src: 'https://picsum.photos/800/600?random=6', alt: 'Snowy mountain', category: 'nature', caption: 'Winter Wonderland' },

    // Architecture (6 images)
    { src: 'https://picsum.photos/800/600?random=7', alt: 'City skyline', category: 'architecture', caption: 'Urban Architecture' },
    { src: 'https://picsum.photos/800/600?random=8', alt: 'Modern building', category: 'architecture', caption: 'Contemporary Design' },
    { src: 'https://picsum.photos/800/600?random=9', alt: 'Historic monument', category: 'architecture', caption: 'Ancient Heritage' },
    { src: 'https://picsum.photos/800/600?random=10', alt: 'Glass building', category: 'architecture', caption: 'Reflective Glass Tower' },
    { src: 'https://picsum.photos/800/600?random=11', alt: 'Modern bridge', category: 'architecture', caption: 'Contemporary Bridge' },
    { src: 'https://picsum.photos/800/600?random=12', alt: 'Modern cathedral', category: 'architecture', caption: 'Contemporary Cathedral' },

    // People (6 images)
    { src: 'https://picsum.photos/800/600?random=13', alt: 'Portrait', category: 'people', caption: 'Elegant Portrait' },
    { src: 'https://picsum.photos/800/600?random=14', alt: 'Group photo', category: 'people', caption: 'Joyful Gathering' },
    { src: 'https.photos/800/600?random=15', alt: 'Street scene', category: 'people', caption: 'Vibrant City Life' },
    { src: 'https://picsum.photos/800/600?random=16', alt: 'Couple portrait', category: 'people', caption: 'Romantic Couple' },
    { src: 'https://picsum.photos/800/600?random=17', alt: 'Business portrait', category: 'people', caption: 'Corporate Portrait' },
    { src: 'https://picsum.photos/800/600?random=18', alt: 'Group of friends', category: 'people', caption: 'Laughter and Joy' }
];

const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxIndex = document.getElementById('lightbox-index');
const filterButtons = document.querySelectorAll('.filter-btn');
let currentImageIndex = 0;
let filteredImages = [...images];

// Lazy loading with IntersectionObserver
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
}, { threshold: 0.1 });

// Create gallery items
function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label',  'View ${image.caption} ');

    const img = document.createElement('img');
    img.dataset.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';
    img.classList.add('lazy', 'loading'); // Add loading class initially

    // Add load event listener for smooth fade-in
    img.addEventListener('load', () => {
        img.classList.remove('loading');
        img.classList.add('loaded');
    });

    // Add error event listener for fallback
    img.addEventListener('error', () => {
        img.classList.remove('loading');
        img.classList.add('error');
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBFcnJvcjwvdGV4dD48L3N2Zz4=';
    });

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <h3>${image.caption}</h3>
        <p>${image.category.charAt(0).toUpperCase() + image.category.slice(1)}</p>
    `;

    item.appendChild(img);
    item.appendChild(overlay);

    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(index);
        }
    });

    imageObserver.observe(img);
    return item;
}

// Initialize gallery
function initGallery() {
    gallery.innerHTML = '';
    filteredImages.forEach((image, index) => {
        const item = createGalleryItem(image, index);
        gallery.appendChild(item);
    });
}

// Filter images
function filterImages(category) {
    if (category === 'all') {
        filteredImages = [...images];
    } else {
        filteredImages = images.filter(img => img.category === category);
    }
    initGallery();
}

// Open lightbox
function openLightbox(index) {
    currentImageIndex = index;
    const image = filteredImages[currentImageIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.caption;
    updateIndex();
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
    trapFocus(lightbox);
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
    releaseFocus();
}

// Update image index display
function updateIndex() {
    lightboxIndex.textContent ='${currentImageIndex + 1} / ${filteredImages.length} ';
}

// Navigate to next/previous image
function navigateImage(direction) {
    currentImageIndex = (currentImageIndex + direction + filteredImages.length) % filteredImages.length;
    const image = filteredImages[currentImageIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.caption;
    updateIndex();
}

// Focus trapping for accessibility
let focusableElements;
let firstFocusableElement;
let lastFocusableElement;

function trapFocus(container) {
    focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
    firstFocusableElement.focus();
}

function releaseFocus() {
    // Focus will return to the gallery item that opened the lightbox
}

// Event listeners
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterImages(button.dataset.filter);
    });
});

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev').addEventListener('click', () => navigateImage(-1));
document.querySelector('.lightbox-next').addEventListener('click', () => navigateImage(1));

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;

    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            navigateImage(-1);
            break;
        case 'ArrowRight':
            navigateImage(1);
            break;
    }
});

// Handle focus trapping
lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                e.preventDefault();
                lastFocusableElement.focus();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
            }
        }
    }
});

// Initialize the gallery on page load
document.addEventListener('DOMContentLoaded', initGallery);