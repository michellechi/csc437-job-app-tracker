// @ts-ignore
import {LitElement, css, html} from "lit";

export class HeaderElement extends LitElement {
  // Property to hold the username
  username: string = ''; // Initially empty, will be fetched from storage

  // Fetch the username from localStorage or other source when the component is connected
  connectedCallback() {
    super.connectedCallback();
    // Get username from localStorage (or adjust according to your app's logic)
    this.username = localStorage.getItem('username') || '';
  }

  // Event handler for toggling dark mode
  toggleDarkMode(event: any) {
    const isChecked = event.target.checked;
    document.body.classList.toggle("dark-mode", isChecked);
  }

  // Event handler for signing out
  signOut() {
    // Clear the username from localStorage (or adjust to your logic)
    localStorage.removeItem('username');
    // Reset the username property and re-render the component
    this.username = '';
    this.requestUpdate(); // Re-render after state change
  }

  render() {
    return html`
      <header class="header_layout">
        <h1>AppTrak</h1>
        <nav class="nav_links">
          <a href="../app">Dashboard</a>
          <a href="../app/application-search-view">Applications</a>
        </nav>
        <div class="action-container">
          <div class="dark-mode-container">
            <label>
              <input
                type="checkbox"
                autocomplete="off"
                class="dark-mode-switch"
                id="dark-mode-checkbox"
                @change="${this.toggleDarkMode}"
              />
              Dark mode
            </label>
          </div>

          <!-- Conditionally render username or login link -->
          <div class="login">
            ${this.username
              ? html`
                  <span>Hello, ${this.username}</span>
                  <button @click="${this.signOut}">Sign Out</button>
                `
              : html`<a href="../app/login">Login</a>`}
          </div>
        </div>
      </header>
    `;
  }

  static styles = css`
    :host {
      display: contents;
      font-family: Aleo, Poppins, Arial;
    }

    .header_layout {
      background-color: var(--color-background-header);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
    }

    .header_layout h1 {
      color: var(--color-title);
      margin-right: auto;
      margin-left: 40px;
    }

    .header_layout .nav_links {
      display: flex;
      gap: 80px; /* Space between navigation links */
      margin-right: auto;
      margin-left: 40px;
    }

    .header_layout .nav_links a {
      color: var(--color-title);
      text-decoration: none;
      font-size: var(--font-size-action);
      transition: color 0.3s ease, transform 0.3s ease;
    }

    .header_layout .nav_links a:hover {
      color: var(--color-gray);
    }

    .action-container {
      display: flex;
      align-items: center;
      font-size: var(--font-size-nav);
      gap: 20px; /* Add spacing between dark mode and login */
    }

    .dark-mode-container {
      color: var(--color-title);
      display: flex;
      align-items: center;
      gap: 20px; /* Space between label and checkbox */
    }

    .login a {
      color: var(--color-title);
      text-decoration: none;
      transition: color 0.3s ease, transform 0.3s ease;
      margin-right: 20px;
    }

    .login a:hover {
      color: var(--color-gray);
    }

    .login span {
      font-weight: bold;
      color: var(--color-title);
    }

    .login button {
      background: none;
      border: none;
      color: var(--color-title);
      cursor: pointer;
      font-size: 14px;
      margin-left: 10px;
      transition: color 0.3s ease, transform 0.3s ease;
    }

    .login button:hover {
      color: var(--color-gray);
    }

    #dark-mode-checkbox {
      margin-left: 5px;
    }
  `;
}
