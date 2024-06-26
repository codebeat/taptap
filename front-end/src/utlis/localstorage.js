//***************session function***************//
export function setItem(key, value) {
  localStorage.setItem(key, value);
  return localStorage.getItem(key) !== null;
}

export function setSession(data) {
  for (const [key, value] of Object.entries(data)) {
    if (setItem(key, value) === false) {
      throw new Error("Failed to set session");
    }
  }
  return true;
}
//***************session function***************//

//***************auth function***************//
export function isAuth() {
  if (localStorage.getItem("auth_token")) {
    return true;
  }
  return false;
}

export function setAuth(token) {
  localStorage.setItem("auth_token", token);
  return localStorage.getItem("auth_token") !== null;
}

export function getAuth() {
  return localStorage.getItem("auth_token");
}

export function clearAuth() {
  localStorage.removeItem("auth_token");
  return localStorage.getItem("auth_token") !== null;
}
//***************auth function***************//

//***************score function***************//
export function getScore() {
  return localStorage.getItem("score");
}

export function setScore(score) {
  localStorage.setItem("score", score);
  return localStorage.getItem("score") !== null;
}
//***************score function***************//

export function clearStorage() {
  localStorage.clear();
}

export function setLocalStorage(key, value) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
}

export function getLocalStorage(key) {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem(key);
    return storedValue;
  }
  return null;
}
