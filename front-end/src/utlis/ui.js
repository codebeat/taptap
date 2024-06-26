export function setBodyClass(class_name) {
  try {
    document.getElementById("body").classList.add(class_name);
  } catch (err) {
    /* empty */
  }
}

export function removeBodyClass(class_name) {
  try {
    document.getElementById("body").classList.remove(class_name);
  } catch (err) {
    /* empty */
  }
}
