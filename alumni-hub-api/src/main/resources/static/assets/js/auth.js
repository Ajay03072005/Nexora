/**
 * Authentication Service
 * Manages user login/logout and current user state
 */

class AuthService {
  static getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  static setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  static logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }

  static isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function () {
  if (!AuthService.isAuthenticated()) {
    // Redirect to login if not authenticated
    const currentPage = window.location.pathname;
    const loginPage = '/login.html';
    if (!currentPage.includes('login')) {
      window.location.href = loginPage;
    }
  }
});
