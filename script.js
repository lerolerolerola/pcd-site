// // VERSÃO PISCAR LOOP
// function piscar(){ 
//   const words = document.querySelectorAll('.word');
//       words.forEach(el => {
//   el.dataset.originalTop = getComputedStyle(el).top;
// });
//   words.forEach(el => {
//     el.style.transition = "top 1s ease-out";
//     el.style.top = "50%";

//     // delay = segundos animacao, muda conteudo, depois volta
//     setTimeout(() => {
//      el.innerHTML = "mudou";
//      el.style.color = "blue";
//       el.style.transition = "top 1.2s ease-in-out";
//       el.style.top = el.dataset.originalTop;
//     }, 1000);
//   });
// };
// // loop da animacao
// setInterval(piscar, 4000);
// let played = false;

// // VERSÃO CAGADA "SCROLL"
// // function piscar(){ 
// //   if (played) return;
// //   const windowBottom = window.innerHeight;
// //   const divScroll = document.getElementById("divGeral");
// //   const divBottom = divScroll.getBoundingClientRect();
// //   const words = document.querySelectorAll('.word');
// //   const spacer = document.getElementById("spacerTeste");
// //   const elipse = document.querySelector(".words-layer");
// //   const progress = window.scrollY;
// //       words.forEach(el => {
// //   el.dataset.originalTop = getComputedStyle(el).top;
// // });
// // if (divBottom.bottom < windowBottom){
// //     played = true;
// //   words.forEach(el => {
// //     el.style.transition = "top 1s ease-out";
// //     el.style.top = "50%";

// //     elipse.style.position = "fixed";
// // elipse.style.top = "0";
// // elipse.style.left = "0";
// // elipse.style.width = "100%"

// //     // delay = segundos animacao, muda conteudo, depois volta
// //     setTimeout(() => {
// //      el.innerHTML = "mudou";
// //      el.style.color = "blue";
// //       el.style.transition = "top 1.2s ease-in-out";
// //       el.style.top = el.dataset.originalTop;

// //     }, 1000);
// //   });
// //   setTimeout(() => {
// //   elipse.style.position = "sticky";
// //   elipse.style.color = "pink";
// //   spacer.style.position = "relative";
// //   const windowTop = window.scrollY;
// //   elipse.style.top = windowTop + "px";
// //     }, 2200);
// //     console.log(spacer, elipse, windowTop);
// // };}

// // let scrollTimeout;
// // const elipse = document.querySelector(".words-layer");
// // const words = document.querySelectorAll(".word");

// // // posicoes originais palavras
// // words.forEach(el => {
// // el.dataset.originalTop = parseFloat(
// // getComputedStyle(el).top
// // );
// // });

// // window.addEventListener("scroll", () => {

// // // velocidade da animacao
// // const progress = window.scrollY * 0.0001; 

// // // Em scroll
// // elipse.style.backgroundColor = "white";
// // words.forEach(el => {
// // const original = parseFloat(el.dataset.originalTop);
// // el.style.top = original + progress + "%";
// // });

// // // Limpar timeout??
// // clearTimeout(scrollTimeout);

// // // Parar
// // scrollTimeout = setTimeout(() => {
// // elipse.style.backgroundColor = "blue";
// // }, 1);

// // });

const words = document.querySelectorAll('.word');
let isLocked = false;
let lockedScrollPos = 0;

words.forEach(el => {
  el.dataset.originalTop = getComputedStyle(el).top;
  
  el.addEventListener('transitionend', () => {
    isLocked = false;
  });
});

window.addEventListener("scroll", () => {
  const progress = window.scrollY;

  if (isLocked) {
    window.scrollTo(0, lockedScrollPos);
    return;
  }
  
  if (progress > 910) {
    if (words[0].innerHTML !== "resist") lockAndTransform("resist", "original", 911);
  } else if (progress > 610) {
    if (words[0].style.top !== "50%") lockAndTransform(null, "50%", 611);
  } else if (progress > 300) {
    if (words[0].innerHTML !== "reform") lockAndTransform("reform", "original", 301);
  } else if (progress > 10) {
    if (words[0].style.top !== "50%") lockAndTransform(null, "50%", 11);
  } else {
    // no inicio
    updateWords("initial text", "original"); 
  }
});

function lockAndTransform(text, topValue, scrollPoint) {
  isLocked = true;
  lockedScrollPos = scrollPoint;
  updateWords(text, topValue);
  
  // SAFETY TIMEOUT: If transitionend fails to fire, unlock anyway after 1.1s
  setTimeout(() => { isLocked = false; }, 1100);
}

function updateWords(text, topValue) {
  words.forEach(el => {
    el.style.transition = "top 1s ease-out";
    
    if (text) el.innerHTML = text;
    el.style.top = (topValue === "original") ? el.dataset.originalTop : topValue;
  });
}