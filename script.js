'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabContainer = document.querySelector('.operations__tab-container');
const tab = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');
const navLink = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////
// Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1Cord = section1.getBoundingClientRect();
  // console.log(s1Cord);

  // console.log(e.target.getBoundingClientRect());

  // console.log('Current Scroll (X/Y)', window.scrollX, window.scrollY);

  // window.scrollTo(s1Cord.left + window.scrollX, s1Cord.top + window.scrollY);

  // window.scrollTo({
  //   left: s1Cord.left + window.scrollX,
  //   top: s1Cord.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

//Smooth Navigation
navLink.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });

    // const currSectionCoord = document.querySelector(id).getBoundingClientRect();
    // console.log(currSectionCoord);
    // window.scrollTo({
    //   left: currSectionCoord.left + window.scrollX,
    //   top: currSectionCoord.top + window.scrollY,
    //   behavior: 'smooth',
    // });
  }
});

//Tabbed Component
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  tab.forEach(t => {
    t.classList.remove('operations__tab--active');
  });

  clicked.classList.add('operations__tab--active');

  tabContent.forEach(c => {
    c.classList.remove('operations__content--active');
  });
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu Fade animation
const handleOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(s => {
      if (link != s) s.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleOver.bind(0.5));

nav.addEventListener('mouseout', handleOver.bind(1));

//Sticky navigation

// const coordTop = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > coordTop.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Using IntersectionObserver API

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections

const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// lazy loading
const allImg = document.querySelectorAll('img[data-src]');

const lazyLoad = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

allImg.forEach(img => {
  imgObserver.observe(img);
});

//Slider
const createSlider = () => {
  const slide = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

  let currSlide = 0;
  const maxSlides = slide.length;

  const moveSlide = curr => {
    slide.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - curr)}%)`;
    });
    activeDot(curr);
  };

  const moveRight = () => {
    if (currSlide == maxSlides - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    moveSlide(currSlide);
  };

  const moveLeft = () => {
    if (currSlide === 0) {
      currSlide = maxSlides - 1;
    } else {
      currSlide--;
    }

    moveSlide(currSlide);
  };

  const createDots = () => {
    slide.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = slide => {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  createDots();

  moveSlide(0);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') moveRight();
    else if (e.key === 'ArrowLeft') moveLeft();
  });

  btnRight.addEventListener('click', moveRight);

  btnLeft.addEventListener('click', moveLeft);

  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      moveSlide(slide);
    }
  });
};

createSlider();

////////////////////////////////////
// Practice only
////////////////////////////////////
///////////////////////////////////////

// let h1 = document.querySelector('h1');

// console.log(h1.children);

// console.log(h1.closest('.header'));

// console.log(document.body);
// console.log(document.documentElement.body);

// const students = [
//   { name: 'Abhishek', marks: 24 },
//   { name: 'b', marks: 90 },
//   { name: 'c', marks: 80 },
//   { name: 'd', marks: 70 },
// ];

// const ans =
//   students
//     .map(stud => ({ ...stud, marks: stud.marks + 1 }))
//     .filter(stud => stud.marks >= 70)
//     .reduce((acc, stud) => acc + stud.marks, 0) / students.length;
// console.log(ans);

// const averageMarks = students
//   .map(student => ({ ...student, marks: student.marks + 1 })) // Add 1 as grace marks to all students
//   .filter(student => student.marks >= 70); // Filter high-scoring students

// console.log(averageMarks);
