// @ts-ignore
import { LitElement, css, html } from "lit";
import { Events, Auth, Observer} from "@calpoly/mustang";

export class HeaderElement extends LitElement {
  username: string = ""; 
  _authObserver = new Observer<Auth.Model>(this, "apptrak:auth");

  connectedCallback() {
    super.connectedCallback();
    this.username = localStorage.getItem('username') || '';
  }

  toggleDarkMode(event: any) {
    const isChecked = event.target.checked;
    document.body.classList.toggle("dark-mode", isChecked);
  }

  signOut(ev:MouseEvent) {
    Events.relay(ev, "auth:message", ["auth/signout"]);
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
