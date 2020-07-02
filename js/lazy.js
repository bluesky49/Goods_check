let images = [...document.querySelectorAll('.lazy-image')];

const interactSettings = {
  root: document.querySelector('.categories'),
  rootMargin: '0px 0px 200px 0px'
}

function onIntersection(imageEntites) {
  imageEntites.forEach(image => {
    if (image.isIntersecting) {
      console.log(image);
      observer.unobserve(image.target)
      image.target.src = image.target.dataset.src
      image.target.onload = () => image.target.classList.add('loaded')
    }
  })
}

let observer = new IntersectionObserver(onIntersection, interactSettings)

images.forEach(image => observer.observe(image))