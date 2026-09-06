document.addEventListener('DOMContentLoaded', function () {
  const pathname = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-item a');

  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;

    const target = href.split('/').pop();
    if (target === pathname || (pathname === '' && target === 'index.html')) {
      link.classList.add('active');
    }
  });

  const header = document.querySelector('.header');
  if (header && window.scrollY > 20) {
    header.classList.add('scrolled');
  }

  window.addEventListener('scroll', function () {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const toggleButton = document.querySelector('.menu-toggle');
  const closeButton = document.querySelector('.close-menu');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.overlay');

  function openMenu() {
    if (mobileMenu) {
      mobileMenu.classList.add('open');
    }
    if (overlay) {
      overlay.classList.add('active');
    }
  }

  function closeMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
    }
    if (overlay) {
      overlay.classList.remove('active');
    }
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', openMenu);
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  document.querySelectorAll('.mobile-menu-item a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (revealItems.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  function animateCounter(counter) {
    const target = Number(counter.dataset.count || 0);
    const suffix = counter.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = target + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  const counterElements = document.querySelectorAll('[data-count]');
  if (counterElements.length) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(function (item) {
      counterObserver.observe(item);
    });
  }

  const filterButtons = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const filter = button.dataset.filter;
      filterButtons.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });

      filterItems.forEach(function (item) {
        const itemCategory = item.dataset.category;
        const show = filter === 'all' || itemCategory === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  const accordions = document.querySelectorAll('.accordion-item');
  accordions.forEach(function (accordion) {
    const trigger = accordion.querySelector('.accordion-header');
    const content = accordion.querySelector('.accordion-content');
    const inner = accordion.querySelector('.accordion-content-inner');

    if (!trigger || !content || !inner) return;

    const open = function () {
      accordions.forEach(function (item) {
        if (item !== accordion) {
          item.classList.remove('active');
          const otherContent = item.querySelector('.accordion-content');
          if (otherContent) {
            otherContent.style.maxHeight = null;
          }
        }
      });

      const isOpen = accordion.classList.contains('active');
      accordion.classList.toggle('active', !isOpen);
      content.style.maxHeight = isOpen ? null : inner.scrollHeight + 'px';
    };

    trigger.addEventListener('click', open);
  });

  const galleryImages = document.querySelectorAll('[data-gallery-item]');
  const lightbox = document.querySelector('.lightbox-modal');
  const lightboxImage = document.querySelector('#lightboxImage');
  const lightboxTitle = document.querySelector('#lightboxTitle');
  const lightboxText = document.querySelector('#lightboxText');
  const lightboxPrev = document.querySelector('#lightboxPrev');
  const lightboxNext = document.querySelector('#lightboxNext');
  const lightboxClose = document.querySelector('#lightboxClose');

  let currentGalleryIndex = 0;
  let currentAlbumImages = [];
  let currentAlbumImageIndex = 0;

  function renderLightbox(imageIndex) {
    if (!galleryImages.length || !lightboxImage || !lightboxTitle || !lightboxText) return;

    const item = galleryImages[currentGalleryIndex];
    const image = currentAlbumImages[imageIndex];
    const title = item.dataset.title || item.querySelector('h3')?.textContent || 'Galeri Kegiatan';
    const text = item.dataset.caption || item.querySelector('p')?.textContent || 'Kegiatan RW 11 Derwati.';

    lightboxImage.src = image;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    lightboxText.textContent = currentAlbumImages.length > 1
      ? text + ' (' + (imageIndex + 1) + '/' + currentAlbumImages.length + ')'
      : text;
  }

  function openLightbox(index) {
    if (!lightbox) return;
    currentGalleryIndex = index;
    const item = galleryImages[index];
    const fallbackImage = item.querySelector('img')?.getAttribute('src');

    try {
      currentAlbumImages = JSON.parse(item.dataset.images || '[]');
    } catch (error) {
      currentAlbumImages = [];
    }

    if (!Array.isArray(currentAlbumImages) || !currentAlbumImages.length) {
      currentAlbumImages = [item.dataset.image || fallbackImage].filter(Boolean);
    }

    currentAlbumImageIndex = 0;
    renderLightbox(currentAlbumImageIndex);
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('open');
    }
  }

  if (galleryImages.length) {
    galleryImages.forEach(function (item, index) {
      item.addEventListener('click', function () {
        openLightbox(index);
      });
    });

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', function () {
        if (!currentAlbumImages.length) return;
        currentAlbumImageIndex = (currentAlbumImageIndex - 1 + currentAlbumImages.length) % currentAlbumImages.length;
        renderLightbox(currentAlbumImageIndex);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', function () {
        if (!currentAlbumImages.length) return;
        currentAlbumImageIndex = (currentAlbumImageIndex + 1) % currentAlbumImages.length;
        renderLightbox(currentAlbumImageIndex);
      });
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  const productCards = document.querySelectorAll('[data-product]');
  const productModal = document.querySelector('.product-modal');
  const productImage = document.querySelector('#productImage');
  const productName = document.querySelector('#productName');
  const productDescription = document.querySelector('#productDescription');
  const productMaterial = document.querySelector('#productMaterial');
  const productCreator = document.querySelector('#productCreator');
  const productClose = document.querySelector('#productClose');
  const productPrev = document.querySelector('#productPrev');
  const productNext = document.querySelector('#productNext');

  let currentProductIndex = 0;

  function renderProduct(index) {
    if (!productCards.length || !productImage || !productName || !productDescription || !productMaterial || !productCreator) return;

    const item = productCards[index];
    if (!item) return;

    productImage.src = item.dataset.image || item.querySelector('img')?.getAttribute('src');
    productName.textContent = item.dataset.name || item.querySelector('h3')?.textContent || 'Produk Daur Ulang';
    productDescription.textContent = item.dataset.description || item.querySelector('p')?.textContent || 'Produk inovatif dari sampah yang dimanfaatkan kembali.';
    productMaterial.textContent = item.dataset.material || 'Bahan: Plastik dan sampah organik';
    productCreator.textContent = item.dataset.creator || 'Pembuat: Komunitas RW 11';
  }

  function openProductModal(index) {
    if (!productModal) return;
    currentProductIndex = index;
    renderProduct(index);
    productModal.classList.add('open');
  }

  function closeProductModal() {
    if (productModal) {
      productModal.classList.remove('open');
    }
  }

  if (productCards.length) {
    productCards.forEach(function (card, index) {
      card.addEventListener('click', function () {
        openProductModal(index);
      });
    });

    if (productPrev) {
      productPrev.addEventListener('click', function () {
        currentProductIndex = (currentProductIndex - 1 + productCards.length) % productCards.length;
        renderProduct(currentProductIndex);
      });
    }

    if (productNext) {
      productNext.addEventListener('click', function () {
        currentProductIndex = (currentProductIndex + 1) % productCards.length;
        renderProduct(currentProductIndex);
      });
    }

    if (productClose) {
      productClose.addEventListener('click', closeProductModal);
    }

    if (productModal) {
      productModal.addEventListener('click', function (event) {
        if (event.target === productModal) {
          closeProductModal();
        }
      });
    }
  }

  const searchInput = document.querySelector('#umkm-search');
  const umkmCards = document.querySelectorAll('.umkm-card');

  if (searchInput && umkmCards.length) {
    searchInput.addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();

      umkmCards.forEach(function (card) {
        const text = card.textContent.toLowerCase();
        const shouldShow = text.includes(query);
        card.classList.toggle('hidden', !shouldShow);
      });
    });
  }

  const featuredSlides = document.querySelectorAll('.featured-slide');
  const featuredPrev = document.querySelector('#featuredPrev');
  const featuredNext = document.querySelector('#featuredNext');
  let slideIndex = 0;

  function showFeaturedSlide(index) {
    if (!featuredSlides.length) return;
    slideIndex = (index + featuredSlides.length) % featuredSlides.length;

    featuredSlides.forEach(function (slide, itemIndex) {
      slide.classList.toggle('active', itemIndex === slideIndex);
    });
  }

  if (featuredPrev) {
    featuredPrev.addEventListener('click', function () {
      showFeaturedSlide(slideIndex - 1);
    });
  }

  if (featuredNext) {
    featuredNext.addEventListener('click', function () {
      showFeaturedSlide(slideIndex + 1);
    });
  }

  if (featuredSlides.length) {
    setInterval(function () {
      showFeaturedSlide(slideIndex + 1);
    }, 5000);
  }
});
