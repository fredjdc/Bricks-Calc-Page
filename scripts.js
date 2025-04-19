// Tailwind configuration
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        theme: {
            container: {
                center: true,
                padding: '1rem',
                screens: {
                    DEFAULT: '100%',
                    sm: '640px',
                    md: '768px',
                    lg: '1024px',
                    xl: '1200px',
                    '2xl': '1200px',
                },
            },
            extend: {
                colors: {
                    border: "hsl(240 5.9% 90%)",
                    input: "hsl(240 5.9% 90%)",
                    ring: "hsl(240 5% 64.9%)",
                    background: "hsl(0 0% 100%)",
                    foreground: "hsl(240 10% 3.9%)",
                    primary: {
                        DEFAULT: "hsl(240 5.9% 10%)",
                        foreground: "hsl(0 0% 98%)",
                    },
                    secondary: {
                        DEFAULT: "hsl(240 4.8% 95.9%)",
                        foreground: "hsl(240 5.9% 10%)",
                    },
                    destructive: {
                        DEFAULT: "hsl(0 84.2% 60.2%)",
                        foreground: "hsl(0 0% 98%)",
                    },
                    muted: {
                        DEFAULT: "hsl(240 4.8% 95.9%)",
                        foreground: "hsl(240 3.8% 46.1%)",
                    },
                    accent: {
                        DEFAULT: "hsl(240 4.8% 95.9%)",
                        foreground: "hsl(240 5.9% 10%)",
                    },
                    popover: {
                        DEFAULT: "hsl(0 0% 100%)",
                        foreground: "hsl(240 10% 3.9%)",
                    },
                    card: {
                        DEFAULT: "hsl(0 0% 100%)",
                        foreground: "hsl(240 10% 3.9%)",
                    },
                    brand: {
                        DEFAULT: "hsl(220 65% 55%)",
                        foreground: "hsl(0 0% 98%)",
                    },
                    success: {
                        DEFAULT: "hsl(142 76% 36%)",
                        foreground: "hsl(0 0% 98%)",
                    }
                },
                borderRadius: {
                    lg: "var(--radius)",
                    md: "calc(var(--radius) - 20px)",
                    sm: "calc(var(--radius) - 40px)",
                },
                fontFamily: {
                    sans: ["Inter", "sans-serif"],
                },
                boxShadow: {
                    'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
                    'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
                },
            },
        },
    };
}

// Utility functions
const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

// DOM Elements cache
let elements = {};

// Function to initialize DOM elements
const initializeElements = () => {
    elements = {
        menuButton: document.getElementById('mobile-menu-button'),
        mobileMenu: document.getElementById('mobile-menu'),
        carousel: document.getElementById('screenshot-carousel'),
        langElement: document.getElementById('current-language'),
        videoModal: document.getElementById('video-modal'),
        openVideoBtn: document.getElementById('open-video-modal'),
        closeVideoBtn: document.getElementById('close-video-modal'),
        modalVideo: document.getElementById('modal-video'),
        // Support page elements
        issueForm: document.getElementById('issue-report-form'),
        fileInput: document.getElementById('file-upload'),
        fileList: document.getElementById('file-list'),
        successAlert: document.getElementById('success-alert'),
        closeSuccess: document.getElementById('close-success'),
        referenceNumber: document.getElementById('reference-number')
    };
};

// Event Handlers
const handleMobileMenu = () => {
    if (elements.mobileMenu) {
        elements.mobileMenu.classList.toggle('hidden');
        if (elements.mobileMenu.__x) {
            elements.mobileMenu.__x.updateElements(elements.mobileMenu);
        }
    }
};

const handleCarousel = (container) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Common handler functions
    const handleStart = (e) => {
        isDown = true;
        container.classList.add('active');
        // Works for both mouse and touch events
        const pageX = e.pageX || (e.touches && e.touches[0].pageX);
        startX = pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        e.preventDefault();
    };

    const handleEnd = () => {
        isDown = false;
        container.classList.remove('active');
    };

    const handleMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        // Works for both mouse and touch events
        const pageX = e.pageX || (e.touches && e.touches[0].pageX);
        const x = pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;
    };

    // Mouse events
    container.addEventListener('mousedown', handleStart);
    container.addEventListener('mouseleave', handleEnd);
    container.addEventListener('mouseup', handleEnd);
    container.addEventListener('mousemove', handleMove);

    // Touch events
    container.addEventListener('touchstart', handleStart, { passive: false });
    container.addEventListener('touchend', handleEnd);
    container.addEventListener('touchcancel', handleEnd);
    container.addEventListener('touchmove', handleMove, { passive: false });
};

// Intersection Observer for animations
const setupIntersectionObserver = () => {
    // Hero image special handling - make it visible immediately
    document.querySelectorAll('.hero-image').forEach(element => {
        if (element) {
            // Make hero image visible immediately
            requestAnimationFrame(() => {
                element.style.opacity = '1';
            });
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // We've already handled hero-image opacity separately above
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
};

// Language handling
const detectUserLanguage = () => {
    const browserLang = (navigator.language || navigator.userLanguage).split('-')[0];
    return ['en', 'es'].includes(browserLang) ? browserLang : 'en';
};

/**
 * Changes the language of the entire application
 * @param {string} lang - The language code ('en' or 'es')
 */
const changeLanguage = (lang) => {
    try {
        // Store user preference
        localStorage.setItem('bricksLanguage', lang);
        
        // Update language display in UI
        if (elements.langElement) {
            elements.langElement.textContent = lang === 'en' ? 'English' : 'Español';
        }
        
        // Update document language attribute
        document.documentElement.setAttribute('lang', lang);
        
        // Hide all language elements first
        document.querySelectorAll('[lang]').forEach(el => {
            el.classList.add('hidden');
        });
        
        // Show only the elements with the selected language
        document.querySelectorAll(`[lang="${lang}"]`).forEach(el => {
            el.classList.remove('hidden');
        });
        
        // Handle mobile language display
        const mobileLangBtn = document.getElementById('mobile-language-switcher');
        if (mobileLangBtn) {
            const mobileLabel = mobileLangBtn.querySelector('span:not(.material-symbols-outlined)');
            if (mobileLabel) {
                mobileLabel.textContent = lang === 'en' ? 'English' : 'Español';
            }
        }
        
        // Update apple-itunes-app meta tag based on language
        const appleItunesAppMeta = document.querySelector('meta[name="apple-itunes-app"]');
        if (appleItunesAppMeta) {
            // Extract the app-id and whichever app-argument corresponds to the selected language
            const content = appleItunesAppMeta.getAttribute('content');
            const appId = content.match(/app-id=([^,]+)/)[1];
            const appArgKey = lang === 'en' ? 'app-argument' : 'app-argument-es';
            const appArgPattern = new RegExp(`${appArgKey}=([^,]+)`);
            const appArgMatch = content.match(appArgPattern);
            
            if (appId && appArgMatch && appArgMatch[1]) {
                // Update the meta tag with just the app-id and the appropriate app-argument
                const newContent = `app-id=${appId}, app-argument=${appArgMatch[1]}`;
                appleItunesAppMeta.setAttribute('content', newContent);
            }
        }
        
        // Update placeholders based on language
        updatePlaceholders(lang);
    } catch (error) {
        console.error('Error changing language:', error);
    }
};

// Update form placeholders based on language
const updatePlaceholders = (lang) => {
    try {
        // Support form placeholders
        const placeholders = {
            name: {
                en: 'Enter your full name',
                es: 'Ingresa tu nombre completo'
            },
            email: {
                en: 'Enter your email address',
                es: 'Ingresa tu correo electrónico'
            },
            description: {
                en: 'Please describe the issue in detail...',
                es: 'Por favor describe el problema en detalle...'
            }
        };
        
        // Update form input placeholders
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const descInput = document.getElementById('issue-description');
        
        if (nameInput) nameInput.placeholder = placeholders.name[lang];
        if (emailInput) emailInput.placeholder = placeholders.email[lang];
        if (descInput) descInput.placeholder = placeholders.description[lang];
    } catch (error) {
        console.error('Error updating placeholders:', error);
    }
};

// Video Modal Handler
const handleVideoModal = () => {
    if (!elements.videoModal || !elements.openVideoBtn || !elements.closeVideoBtn) {
        console.error('Video modal elements not found');
        return;
    }
    
    const openModal = (e) => {
        e.preventDefault();
        
        // Load the correct video source based on current language
        if (elements.modalVideo) {
            const currentLang = localStorage.getItem('bricksLanguage') || detectUserLanguage();
            
            // More direct approach to set the correct source
            const videoEl = elements.modalVideo;
            
            // Define video paths based on language
            const videoSources = {
                'en': 'images/app-preview-en.mp4',
                'es': 'images/app-preview-es.mp4'
            };
            
            // Get the appropriate source for the current language
            const sourcePath = videoSources[currentLang] || videoSources['en']; // Fallback to English
            
            console.log(`Setting video source to: ${sourcePath} for language: ${currentLang}`);
            
            // Directly set the src attribute on the video element
            videoEl.src = sourcePath;
            videoEl.load();
        }
        
        elements.videoModal.classList.add('opacity-100');
        elements.videoModal.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
        
        // Only try to play the video after the modal transition completes
        if (elements.modalVideo) {
            setTimeout(() => {
                elements.modalVideo.play()
                    .catch(err => console.error('Error playing video:', err));
            }, 300); // Match the transition duration
        }
    };

    const closeModal = () => {
        elements.videoModal.classList.remove('opacity-100');
        elements.videoModal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
        if (elements.modalVideo) {
            elements.modalVideo.pause();
        }
    };

    elements.openVideoBtn.addEventListener('click', openModal);
    elements.closeVideoBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the content
    elements.videoModal.addEventListener('click', (e) => {
        if (e.target === elements.videoModal) {
            closeModal();
        }
    });

    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.videoModal.classList.contains('pointer-events-none')) {
            closeModal();
        }
    });
};

// Support form functionality
const initSupportForm = () => {
    if (!elements.issueForm) return;
    
    // Selected files storage
    let selectedFiles = [];
    
    // Handle file selection
    if (elements.fileInput) {
        elements.fileInput.addEventListener('change', function() {
            const files = Array.from(this.files);
            
            // Check file size (limit to 5MB per file)
            const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
            
            if (validFiles.length !== files.length) {
                const lang = document.documentElement.getAttribute('lang') || 'en';
                alert(lang === 'en' ? 'Some files exceed the 5MB limit and were not included.'
                    : 'Algunos archivos exceden el límite de 5MB y no se incluyeron.');
            }
            
            if (validFiles.length > 0) {
                selectedFiles = [...selectedFiles, ...validFiles];
                updateFileList(selectedFiles);
                elements.fileList.classList.remove('hidden');
            }
        });
    }
    
    // Generate a unique reference number
    const generateReferenceNumber = () => {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `BRKS-${timestamp}${random}`;
    };
    
    // Show success alert
    const showSuccessAlert = (refNumber) => {
        if (!elements.successAlert || !elements.referenceNumber) return;
        
        elements.referenceNumber.textContent = refNumber;
        elements.successAlert.classList.remove('opacity-0', 'pointer-events-none');
        elements.successAlert.classList.add('opacity-100');
        
        const alertBox = elements.successAlert.querySelector('div');
        if (alertBox) {
            alertBox.classList.remove('scale-95');
            alertBox.classList.add('scale-100');
        }
    };
    
    // Hide success alert
    const hideSuccessAlert = () => {
        if (!elements.successAlert) return;
        
        const alertBox = elements.successAlert.querySelector('div');
        if (alertBox) {
            alertBox.classList.remove('scale-100');
            alertBox.classList.add('scale-95');
        }
        
        setTimeout(() => {
            elements.successAlert.classList.remove('opacity-100');
            elements.successAlert.classList.add('opacity-0', 'pointer-events-none');
        }, 200);
    };
    
    // Close success alert button handler
    if (elements.closeSuccess) {
        elements.closeSuccess.addEventListener('click', hideSuccessAlert);
    }
    
    // Handle form submission
    if (elements.issueForm) {
        elements.issueForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const descInput = document.getElementById('issue-description');
            
            if (!nameInput || !emailInput || !descInput) return;
            
            const formData = new FormData();
            formData.append('name', nameInput.value);
            formData.append('email', emailInput.value);
            formData.append('description', descInput.value);
            
            // Add files to FormData
            selectedFiles.forEach(file => {
                formData.append('files[]', file);
            });
            
            // Generate reference number
            const refNumber = generateReferenceNumber();
            formData.append('reference', refNumber);
            
            // In a real implementation, you would send this data to the server using:
            // fetch('/submit-issue', {
            //     method: 'POST',
            //     body: formData
            // })
            
            // For this example, we'll simulate sending the data
            setTimeout(() => {
                // Reset form
                elements.issueForm.reset();
                selectedFiles = [];
                elements.fileList.innerHTML = '';
                elements.fileList.classList.add('hidden');
                
                // Show success alert
                showSuccessAlert(refNumber);
                
                // Log data for debugging
                console.log('Form submitted!');
                console.log('Reference number:', refNumber);
                console.log('Name:', formData.get('name'));
                console.log('Email:', formData.get('email'));
                console.log('Description:', formData.get('description'));
                console.log('Files:', selectedFiles.map(f => f.name));
                
                // In a real implementation, you would send an email to hola@bricks.pe with this data
                // This requires server-side processing and cannot be done with client-side JavaScript alone
                
            }, 1000); // Simulate network delay
        });
    }
};

// Update file list display
const updateFileList = (files) => {
    if (!elements.fileList) return;
    elements.fileList.innerHTML = '';
    
    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'flex justify-between items-center p-2 bg-gray-50 rounded';
        
        const fileInfo = document.createElement('div');
        fileInfo.className = 'flex items-center';
        
        // File icon based on type
        const fileIcon = document.createElement('div');
        fileIcon.className = 'mr-2 text-gray-500';
        
        if (file.type.startsWith('image/')) {
            fileIcon.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
        } else if (file.type.startsWith('video/')) {
            fileIcon.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
        } else {
            fileIcon.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
        }
        
        // File name and size
        const fileName = document.createElement('div');
        fileName.textContent = file.name;
        fileName.className = 'text-sm';
        
        const fileSize = document.createElement('div');
        fileSize.textContent = formatFileSize(file.size);
        fileSize.className = 'text-xs text-gray-500';
        
        const fileDetails = document.createElement('div');
        fileDetails.className = 'ml-2';
        fileDetails.appendChild(fileName);
        fileDetails.appendChild(fileSize);
        
        fileInfo.appendChild(fileIcon);
        fileInfo.appendChild(fileDetails);
        
        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'text-gray-500 hover:text-red-500 focus:outline-none transition-colors';
        removeBtn.type = 'button';
        removeBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
        removeBtn.addEventListener('click', function() {
            files.splice(index, 1);
            updateFileList(files);
            
            if (files.length === 0) {
                elements.fileList.classList.add('hidden');
            }
        });
        
        fileItem.appendChild(fileInfo);
        fileItem.appendChild(removeBtn);
        elements.fileList.appendChild(fileItem);
    });
};

// Format file size to human-readable format
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Language switcher setup
const setupLanguageSwitcher = () => {
    const languageSwitcher = document.getElementById('language-switcher');
    const mobileLanguageSwitcher = document.getElementById('mobile-language-switcher');
    
    // Initial language
    const savedLang = localStorage.getItem('bricksLanguage');
    const initialLang = savedLang || detectUserLanguage();
    changeLanguage(initialLang);
    
    // Toggle language onClick
    const toggleLanguage = () => {
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        const newLang = currentLang === 'en' ? 'es' : 'en';
        changeLanguage(newLang);
    };
    
    // Language switchers
    if (languageSwitcher) {
        languageSwitcher.addEventListener('click', toggleLanguage);
    }
    
    if (mobileLanguageSwitcher) {
        mobileLanguageSwitcher.addEventListener('click', toggleLanguage);
    }
};

/**
 * Handles the desktop app banner functionality
 * Shows a banner on desktop devices to promote the mobile app
 */
const handleDesktopAppBanner = () => {
    // Skip on mobile devices since they use the native Smart App Banner
    if (window.innerWidth < 640 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        return;
    }
    
    const banner = document.getElementById('desktop-app-banner');
    const closeBtn = document.getElementById('desktop-app-banner-close');
    const downloadBtn = document.getElementById('desktop-app-banner-button');
    
    // Check if user has closed the banner before
    const isBannerClosed = localStorage.getItem('desktop_app_banner_closed') === 'true';
    
    if (!isBannerClosed && banner) {
        // Show the banner and adjust the page layout
        banner.style.display = 'flex';
        document.body.classList.add('has-app-banner');
        
        // Close button functionality
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                banner.style.display = 'none';
                document.body.classList.remove('has-app-banner');
                // Remember that user closed the banner
                localStorage.setItem('desktop_app_banner_closed', 'true');
            });
        }
        
        // Download button functionality
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                // Get current language
                const currentLang = document.documentElement.getAttribute('lang') || 'en';
                
                // Get download links from meta tag
                const meta = document.querySelector('meta[name="apple-itunes-app"]');
                let appLink = '';
                
                if (meta) {
                    const content = meta.getAttribute('content');
                    const appArgKey = currentLang === 'en' ? 'app-argument' : 'app-argument-es';
                    const appArgPattern = new RegExp(`${appArgKey}=([^,]+)`);
                    const appArgMatch = content.match(appArgPattern);
                    
                    if (appArgMatch && appArgMatch[1]) {
                        appLink = appArgMatch[1];
                    }
                }
                
                // Fallback to app store download links if meta tag approach doesn't work
                if (!appLink) {
                    const downloadBtn = document.querySelector('#app-store-download');
                    if (downloadBtn) {
                        appLink = downloadBtn.getAttribute(`data-link-${currentLang}`);
                    }
                }
                
                // Track the event in Google Analytics
                if (typeof gtag === 'function') {
                    gtag('event', 'app_download', {
                        'event_category': 'engagement',
                        'event_label': 'desktop_app_banner'
                    });
                }
                
                // Open the app store
                if (appLink) {
                    window.open(appLink, '_blank');
                }
            });
        }
    }
};

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize element references
    initializeElements();
    
    // Add event listeners
    if (elements.menuButton) {
        elements.menuButton.addEventListener('click', handleMobileMenu);
    }
    
    if (elements.carousel) {
        handleCarousel(elements.carousel);
    }
    
    // Video modal handling
    if (elements.openVideoBtn && elements.videoModal) {
        handleVideoModal();
    }
    
    // Support form handling
    if (elements.issueForm) {
        initSupportForm();
    }
    
    // Setup language switcher if available
    setupLanguageSwitcher();
    
    // Setup intersection observer for animations
    setupIntersectionObserver();
    
    // Setup desktop app banner
    handleDesktopAppBanner();
    
    // Set language based on stored preference or browser language
    const storedLang = localStorage.getItem('bricksLanguage');
    const userLang = storedLang || detectUserLanguage();
    changeLanguage(userLang);
    
    // Add resize event listener for layout adjustments
    window.addEventListener('resize', debounce(() => {
        // Recalculate or adjust UI elements on resize if needed
        if (window.innerWidth >= 640) {
            // Reset mobile menu visibility on desktop
            if (elements.mobileMenu) {
                elements.mobileMenu.classList.add('hidden');
            }
            
            // Check desktop app banner visibility
            const banner = document.getElementById('desktop-app-banner');
            const isBannerClosed = localStorage.getItem('desktop_app_banner_closed') === 'true';
            
            if (banner && !isBannerClosed && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                banner.style.display = 'flex';
                document.body.classList.add('has-app-banner');
            }
        } else {
            // Hide desktop app banner on mobile
            const banner = document.getElementById('desktop-app-banner');
            if (banner) {
                banner.style.display = 'none';
                document.body.classList.remove('has-app-banner');
            }
        }
    }, 250));
}); 