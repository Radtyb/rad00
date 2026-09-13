/**
 * V2BOX Pro - Persian Cyber-Glass Vanilla JavaScript
 * Clean, lightweight, 100% dependency-free for direct GitHub Pages deployment
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initOrderModal();
  initFaqAccordion();
  initLatencyTelemetry();
  initMobileMenu();
});

// 1. Navigation Active State
function initNavigation() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('[data-nav-link]');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('bg-secondary-container', 'text-on-secondary-container', 'shadow-[0_0_20px_rgba(87,27,193,0.35)]');
      link.classList.remove('text-on-surface-variant', 'hover:bg-surface-container-high');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('bg-secondary-container', 'text-on-secondary-container', 'shadow-[0_0_20px_rgba(87,27,193,0.35)]');
      link.classList.add('text-on-surface-variant');
    }
  });
}

// 2. Mobile Menu Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const menuDrawer = document.getElementById('mobile-menu-drawer');
  const closeBtn = document.getElementById('mobile-menu-close');
  
  if (!toggleBtn || !menuDrawer) return;

  const openMenu = () => {
    menuDrawer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    menuDrawer.classList.add('hidden');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  menuDrawer.addEventListener('click', (e) => {
    if (e.target === menuDrawer) closeMenu();
  });
}

// 3. Telegram Order Modal System
const PLAN_DATA = {
  basic: {
    id: 'basic',
    name: 'پلن پایه (Basic)',
    price10: 25000,
    price30: 65000,
    price90: 180000,
    volume: '۵ گیگابایت',
    users: '۵ کاربر همزمان',
    features: ['حجم: ۵ گیگابایت', 'محدودیت کاربر: ۵ کاربر', 'مناسب هوش مصنوعی (ChatGPT)', 'سازگار با همراه اول و ایرانسل']
  },
  standard: {
    id: 'standard',
    name: 'پلن استاندارد (Standard)',
    price10: 50000,
    price30: 130000,
    price90: 360000,
    volume: '۱۰ گیگابایت',
    users: '۵ کاربر همزمان',
    features: ['حجم: ۱۰ گیگابایت', 'محدودیت کاربر: ۵ کاربر', 'مناسب هوش مصنوعی و استریم', 'سازگار با همراه اول، ایرانسل و رایتل']
  },
  turbo: {
    id: 'turbo',
    name: 'پلن ویژه (Pro Turbo)',
    price10: 75000,
    price30: 195000,
    price90: 540000,
    volume: '۱۵ گیگابایت',
    users: '۵ کاربر همزمان',
    featured: true,
    features: ['حجم: ۱۵ گیگابایت', 'محبوب‌ترین انتخاب کاربران', 'اتصال همزمان ۵ کاربر', 'آی‌پی اختصاصی تمیز مناسب ترید و هوش مصنوعی', 'سازگار با کلیه اپراتورها']
  },
  ultimate: {
    id: 'ultimate',
    name: 'پلن نامحدود (Ultimate)',
    price10: 100000,
    price30: 260000,
    price90: 720000,
    volume: '۲۰ گیگابایت',
    users: '۵ کاربر همزمان',
    features: ['حجم: ۲۰ گیگابایت', 'سرعت نامحدود گیگابیتی', 'اتصال همزمان ۵ کاربر', 'مناسب دانلود سنگین و گیمینگ با پینگ پایین', 'پشتیبانی اولویت‌دار']
  }
};

let currentOrder = {
  planId: 'turbo',
  duration: '10', // '10' or '30' or '90'
  operator: 'همراه اول'
};

function initOrderModal() {
  const modal = document.getElementById('order-modal');
  if (!modal) return;

  const modalCloseBtns = modal.querySelectorAll('[data-modal-close]');
  const buyBtns = document.querySelectorAll('[data-buy-plan]');
  
  buyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planId = btn.getAttribute('data-buy-plan') || 'turbo';
      openOrderModal(planId);
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeOrderModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeOrderModal();
  });

  // Duration buttons in modal
  const durationBtns = modal.querySelectorAll('[data-duration-btn]');
  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => {
        b.classList.remove('bg-primary-container', 'text-white', 'border-primary');
        b.classList.add('bg-surface-container-high/60', 'text-on-surface-variant');
      });
      btn.classList.remove('bg-surface-container-high/60', 'text-on-surface-variant');
      btn.classList.add('bg-primary-container', 'text-white', 'border-primary');
      currentOrder.duration = btn.getAttribute('data-duration-btn');
      updateModalDetails();
    });
  });

  // Operator select
  const operatorSelect = document.getElementById('modal-operator-select');
  if (operatorSelect) {
    operatorSelect.addEventListener('change', (e) => {
      currentOrder.operator = e.target.value;
      updateModalDetails();
    });
  }

  // Copy Order text
  const copyBtn = document.getElementById('modal-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const orderText = generateOrderText();
      navigator.clipboard.writeText(orderText).then(() => {
        showToast('متن سفارش کپی شد! می‌توانید به پشتیبانی ارسال کنید.');
      }).catch(() => {
        showToast('متن سفارش آماده است.');
      });
    });
  }
}

function openOrderModal(planId) {
  const modal = document.getElementById('order-modal');
  if (!modal) return;

  currentOrder.planId = planId in PLAN_DATA ? planId : 'turbo';
  updateModalDetails();

  modal.classList.remove('modal-hidden');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  const modal = document.getElementById('order-modal');
  if (!modal) return;

  modal.classList.add('modal-hidden');
  document.body.style.overflow = '';
}

function calculateCurrentPrice() {
  const plan = PLAN_DATA[currentOrder.planId] || PLAN_DATA.turbo;
  if (currentOrder.duration === '30') return plan.price30;
  if (currentOrder.duration === '90') return plan.price90;
  return plan.price10;
}

function getDurationLabel() {
  if (currentOrder.duration === '30') return '۳۰ روزه (۱ ماه)';
  if (currentOrder.duration === '90') return '۹۰ روزه (۳ ماه)';
  return '۱۰ روزه';
}

function updateModalDetails() {
  const plan = PLAN_DATA[currentOrder.planId] || PLAN_DATA.turbo;
  const price = calculateCurrentPrice();
  const durationLabel = getDurationLabel();

  const titleEl = document.getElementById('modal-plan-title');
  const priceEl = document.getElementById('modal-plan-price');
  const durationEl = document.getElementById('modal-plan-duration');
  const volumeEl = document.getElementById('modal-plan-volume');
  const tgLinkDirect = document.getElementById('modal-tg-direct-link');
  const tgBotLink = document.getElementById('modal-tg-bot-link');

  if (titleEl) titleEl.textContent = plan.name;
  if (priceEl) priceEl.textContent = price.toLocaleString('fa-IR');
  if (durationEl) durationEl.textContent = durationLabel;
  if (volumeEl) volumeEl.textContent = plan.volume;

  const orderText = generateOrderText();
  const encodedText = encodeURIComponent(orderText);

  // Direct support link
  if (tgLinkDirect) {
    tgLinkDirect.href = `https://t.me/Radvin45?text=${encodedText}`;
  }
  // Bot link
  if (tgBotLink) {
    tgBotLink.href = `http://t.me/v2boxprobot?start=order_${currentOrder.planId}_${currentOrder.duration}`;
  }
}

function generateOrderText() {
  const plan = PLAN_DATA[currentOrder.planId] || PLAN_DATA.turbo;
  const price = calculateCurrentPrice();
  const durationLabel = getDurationLabel();

  return `سلام، درخواست خرید کانفیگ V2BOX Pro دارم:
🏷 پلن: ${plan.name}
⏳ مدت زمان: ${durationLabel}
📦 حجم: ${plan.volume}
👥 کاربران: ۵ کاربر همزمان
📡 اپراتور مورد نظر: ${currentOrder.operator}
💳 مبلغ: ${price.toLocaleString('fa-IR')} تومان
لطفاً اطلاعات پرداخت و کانفیگ را ارسال فرمایید.`;
}

// 4. Toast Notification
function showToast(message) {
  let toast = document.getElementById('cyber-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cyber-toast';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl bg-surface-container-high border border-primary/40 text-on-surface shadow-2xl backdrop-blur-xl font-medium text-sm transition-all duration-300 opacity-0 translate-y-4 pointer-events-none flex items-center gap-2';
    toast.innerHTML = `<span class="material-symbols-outlined text-primary text-lg">check_circle</span> <span id="toast-text"></span>`;
    document.body.appendChild(toast);
  }

  const textEl = document.getElementById('toast-text');
  if (textEl) textEl.textContent = message;

  toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.remove('opacity-100', 'translate-y-0');
  }, 3200);
}

// 5. FAQ Accordion for about.html
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('[data-faq-item]');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('[data-faq-trigger]');
    const answer = item.querySelector('[data-faq-answer]');
    const icon = item.querySelector('[data-faq-icon]');

    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isOpen = !answer.classList.contains('hidden');
      
      // Close all others
      faqItems.forEach(other => {
        const otherAnswer = other.querySelector('[data-faq-answer]');
        const otherIcon = other.querySelector('[data-faq-icon]');
        if (otherAnswer) otherAnswer.classList.add('hidden');
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        answer.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

// 6. Real-Time Telemetry Simulation (Ping latency simulator)
function initLatencyTelemetry() {
  const servers = [
    { id: 'ping-frankfurt', base: 48, jitter: 6 },
    { id: 'ping-helsinki', base: 54, jitter: 8 },
    { id: 'ping-amsterdam', base: 42, jitter: 5 },
    { id: 'ping-istanbul', base: 31, jitter: 4 }
  ];

  setInterval(() => {
    servers.forEach(server => {
      const el = document.getElementById(server.id);
      if (el) {
        const currentPing = server.base + Math.floor(Math.random() * server.jitter * 2 - server.jitter);
        el.textContent = `${currentPing} ms`;
      }
    });
  }, 2500);
}
