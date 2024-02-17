const DECITION_THRESHOLD = 80;

let inAnimating = false;
let pullDeltaX = 0;

const startDrag = (e) => {
  if (inAnimating) return;
  
  const actualCard = e.target.closest('article');

  const startX = e.pageX ?? e.touches[0].pageX;

  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag, {passive: true});

  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag, {passive: true});

  function drag(e){
    const currentX = e.pageX ?? e.touches[0].pageX;

    pullDeltaX = currentX - startX;

    if (pullDeltaX === 0) return;

    inAnimating = true;

    const deg = pullDeltaX / 10;

    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

    actualCard.style.cursor = 'grabbing';

    const opacity = Math.abs(pullDeltaX) / 100;

    const isRight = pullDeltaX > 0;

    const choiceEl = isRight ? actualCard.querySelector('.choice.like') : actualCard.querySelector('.choice.nope');

    choiceEl.style.opacity = opacity;
  }
  
  function endDrag(e){
    //remove event listeners
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);

    const decisionMade = Math.abs(pullDeltaX) > DECITION_THRESHOLD;

    if (decisionMade) {
      const goRight = pullDeltaX >= 0;

      actualCard.classList.add(goRight ? 'go-right' : 'go-left');
      actualCard.addEventListener('transitionend', () => {
        actualCard.remove();
        inAnimating = false;
      }, {once: true});
    } else {
      actualCard.removeAttribute('style');
      actualCard.classList.add('reset');
      inAnimating = false;
    }

    actualCard.addEventListener('transitionend', () => {
      actualCard.removeAttribute('style');
      actualCard.classList.remove('reset');
      actualCard.classList.remove('go-right');
      actualCard.classList.remove('go-left');
      actualCard.style.cursor = 'grab';

      inAnimating = false;
      pullDeltaX = 0;
    }, {once: true});

    actualCard.querySelector('.choice.like').style.opacity = 0;
    actualCard.querySelector('.choice.nope').style.opacity = 0;
  }
}


document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag, {passive: true});