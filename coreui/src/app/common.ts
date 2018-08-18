export function mouseenterLevel2(event) {
  let oldEl = document.getElementsByClassName("level-2");
  for (let i = 0; i < oldEl.length; i++) {
    if (!oldEl[i].classList.contains("current-level-2")) {
      oldEl[i].classList.remove("active");
    }
  }
  let newEl = event.currentTarget;
  newEl.classList.add("active");
}
