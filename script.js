// ---------------------------------------------
// Amazon clone - minimal JS
// Features: 1) search filter  2) cart counter  3) "See More" click feedback
// ---------------------------------------------

document.addEventListener('DOMContentLoaded', function () {

  var searchInput = document.getElementById('searchInput');
  var searchBtn = document.getElementById('searchBtn');
  var shopSection = document.querySelector('.shop-section');
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.box'));
  var cartBtn = document.getElementById('cartBtn');
  var cartCount = document.getElementById('cartCount');

  var cartItems = {}; // e.g. { "Electronics": 2, "Clothes": 1 }
  var noResultsMsg = null;

  // ---------- 1) Search filter ----------
  // Typing/searching shows only the category boxes whose title matches.
  function runSearch() {
    var query = searchInput.value.trim().toLowerCase();
    var matches = 0;

    boxes.forEach(function (box) {
      var category = (box.getAttribute('data-category') || '').toLowerCase();
      var isMatch = query === '' || category.indexOf(query) !== -1;
      box.classList.toggle('hidden', !isMatch);
      if (isMatch) matches++;
    });

    // show/remove a "no results" message
    if (matches === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('p');
        noResultsMsg.className = 'no-results';
        shopSection.appendChild(noResultsMsg);
      }
      noResultsMsg.textContent = 'No results found for "' + searchInput.value + '"';
    } else if (noResultsMsg) {
      noResultsMsg.remove();
      noResultsMsg = null;
    }
  }

  searchBtn.addEventListener('click', runSearch);
  searchInput.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') runSearch();
  });

  // ---------- 2) Cart dropdown ----------
  // Clicking the cart icon opens/closes a panel listing every item added so far.
  var cartDropdown = document.getElementById('cartDropdown');

  function renderCartDropdown() {
    var categories = Object.keys(cartItems);

    if (categories.length === 0) {
      cartDropdown.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
      return;
    }

    var html = '';
    var total = 0;

    categories.forEach(function (category) {
      var qty = cartItems[category];
      total += qty;
      html += '<div class="cart-item-row"><span>' + category + '</span><span>x' + qty + '</span></div>';
    });

    html += '<div class="cart-total-row"><span>Total items</span><span>' + total + '</span></div>';
    cartDropdown.innerHTML = html;
  }

  cartBtn.addEventListener('click', function () {
    cartDropdown.classList.toggle('open');
  });

  // clicking anywhere outside the cart button closes the dropdown
  document.addEventListener('click', function (e) {
    if (!cartBtn.contains(e.target)) {
      cartDropdown.classList.remove('open');
    }
  });

  // ---------- 3) "See More" click feedback ----------
  // Clicking "See More" on a card scrolls it into full view and briefly highlights it.
  document.querySelectorAll('.see-more').forEach(function (el) {
    el.addEventListener('click', function () {
      var box = el.closest('.box');
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      box.classList.add('highlight');
      setTimeout(function () {
        box.classList.remove('highlight');
      }, 1000);
    });
  });

  // ---------- 4) Hero banner slider ----------
  // Auto-advances every 4s; prev/next arrows and dots allow manual control.
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dotsContainer = document.getElementById('heroDots');
  var prevBtn = document.getElementById('heroPrev');
  var nextBtn = document.getElementById('heroNext');
  var current = 0;
  var slideTimer = null;

  // build one dot per slide
  slides.forEach(function (slide, i) {
    var dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function () {
      goToSlide(i);
      resetTimer();
    });
    dotsContainer.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsContainer.querySelectorAll('.hero-dot'));

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function resetTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(function () {
      goToSlide(current + 1);
    }, 4000);
  }

  prevBtn.addEventListener('click', function () {
    goToSlide(current - 1);
    resetTimer();
  });

  nextBtn.addEventListener('click', function () {
    goToSlide(current + 1);
    resetTimer();
  });

  resetTimer(); // start auto-play

  // ---------- 5) Add to Cart with popup ----------
  // Clicking a box's "Add to Cart" bumps the cart count and shows a brief toast message.
  var toast = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2000);
  }

  document.querySelectorAll('.add-to-cart-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('.box');
      var category = box.getAttribute('data-category') || 'Item';

      cartItems[category] = (cartItems[category] || 0) + 1;

      var totalCount = Object.values(cartItems).reduce(function (sum, qty) {
        return sum + qty;
      }, 0);
      cartCount.textContent = totalCount;

      renderCartDropdown();
      showToast('Added "' + category + '" to cart');
    });
  });

});