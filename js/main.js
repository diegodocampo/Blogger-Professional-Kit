'use strict';

document.addEventListener('DOMContentLoaded', () => {

    initNavigation();
    initFaq();
    initScrollTop();
    initSmoothScroll();
    initHeader();
    initForms();
    initAnimations();

});

function initNavigation() {

    const navigation = document.getElementById('navigation');
    const toggle = document.querySelector('.nav-toggle');

    if (!navigation || !toggle) return;

    toggle.addEventListener('click', () => {
        navigation.classList.toggle('is-open');
        toggle.classList.toggle('is-active');
    });

    navigation.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navigation.classList.remove('is-open');
            toggle.classList.remove('is-active');
        });
    });

}

function initHeader() {

    const header = document.getElementById('header');

    if (!header) return;

    const updateHeader = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 50);
    };

    updateHeader();

    window.addEventListener('scroll', updateHeader);

}

function initScrollTop() {

    const button = document.querySelector('.scroll-top');

    if (!button) return;

    const updateButton = () => {
        button.classList.toggle('is-visible', window.scrollY > 400);
    };

    updateButton();

    window.addEventListener('scroll', updateButton);

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

}

function initSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener('click', event => {

            const target = document.querySelector(anchor.getAttribute('href'));

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        });

    });

}

function initFaq() {

    document.querySelectorAll('.faq-item').forEach(item => {

        const trigger = item.querySelector('.faq-question');

        if (!trigger) return;

        trigger.addEventListener('click', () => {

            const expanded = trigger.getAttribute('aria-expanded') === 'true';

            trigger.setAttribute('aria-expanded', !expanded);

            item.classList.toggle('is-open');

        });

    });

}

function initForms() {

    document.querySelectorAll('form').forEach(form => {

        form.addEventListener('submit', event => {

            if (!form.checkValidity()) {

                event.preventDefault();

                form.classList.add('has-errors');

                form.reportValidity();

            } else {

                form.classList.remove('has-errors');

            }

        });

    });

}

function initAnimations() {

    const elements = document.querySelectorAll('.animate');

    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add('is-visible');

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.15
    });

    elements.forEach(element => observer.observe(element));

}

function debounce(callback, delay = 200) {

    let timeout;

    return (...args) => {

        clearTimeout(timeout);

        timeout = setTimeout(() => callback(...args), delay);

    };

}

function throttle(callback, delay = 200) {

    let waiting = false;

    return (...args) => {

        if (waiting) return;

        callback(...args);

        waiting = true;

        setTimeout(() => {
            waiting = false;
        }, delay);

    };

}
