import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";

export class LoginViewElement extends LitElement {
  @state() username: string = "";
  @state() password: string = "";
  @state() confirmPassword: string = ""; // For registration
  @state() errorMessage: string = "";
  @state() successMessage: string = "";
  @state() isRegister: boolean = false; // Toggles between Login and Register views

  handleLogin() {
    console.log("Attempting login with:", { username: this.username });

    fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Login successful!");
          window.location.href = "/";
        } else {
          throw new Error("Invalid username or password");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        this.errorMessage = "Invalid username or password. Please try again.";
      });
  }

  handleRegister() {
    console.log("Attempting registration with:", {
      username: this.username,
      password: this.password,
      confirmPassword: this.confirmPassword,
    });

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match!";
      return;
    }

    fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Registration successful!");
          this.successMessage = "Registration successful! You can now log in.";
          this.isRegister = false; // Switch to login view
          this.errorMessage = ""; // Clear errors
        } else {
          return response.json().then((data) => {
            throw new Error(data.message || "Registration failed");
          });
        }
      })
      .catch((error) => {
        console.error("Registration failed:", error);
        this.errorMessage =
          error.message || "Registration failed. Please try again.";
      });
  }

  toggleView() {
    this.isRegister = !this.isRegister;
    this.errorMessage = "";
    this.successMessage = "";
    this.username = "";
    this.password = "";
    this.confirmPassword = "";
  }

  render() {
    return html`
      <main class="page">
        <section class="form-container">
          <h2>${this.isRegister ? "Create an Account" : "Welcome Back!"}</h2>
          <p class="subtitle">
            ${this.isRegister
              ? "Sign up to start your journey."
              : "Login to access your account."}
          </p>

          <!-- Error or success messages -->
          ${this.errorMessage
            ? html`<p class="error-message">${this.errorMessage}</p>`
            : ""}
          ${this.successMessage
            ? html`<p class="success-message">${this.successMessage}</p>`
            : ""}

          <!-- Form for login or registration -->
          <form @submit="${(e: Event) => e.preventDefault()}">
            <input
              type="text"
              id="username"
              placeholder="Username"
              .value="${this.username}"
              @input="${(e: Event) =>
                (this.username = (e.target as HTMLInputElement).value)}"
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              .value="${this.password}"
              @input="${(e: Event) =>
                (this.password = (e.target as HTMLInputElement).value)}"
              required
            />
            ${this.isRegister
              ? html`
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    .value="${this.confirmPassword}"
                    @input="${(e: Event) =>
                      (this.confirmPassword = (
                        e.target as HTMLInputElement
                      ).value)}"
                    required
                  />
                `
              : ""}

            <button
              @click="${this.isRegister
                ? this.handleRegister
                : this.handleLogin}"
            >
              ${this.isRegister ? "Register" : "Login"}
            </button>
          </form>

          <!-- Toggle between login and registration view -->
          <p class="toggle-link">
            ${this.isRegister
              ? html`
                  Already have an account?
                  <a @click="${this.toggleView}" href="javascript:void(0)"
                    >Login</a
                  >
                `
              : html`
                  Don't have an account?
                  <a @click="${this.toggleView}" href="javascript:void(0)"
                    >Register</a
                  >
                `}
          </p>
        </section>
      </main>
    `;
  }

  static styles = css`
    :host {
      display: block;
      background-color: #f5f5f5;
      font-family: "Arial", sans-serif;
      height: 100vh;
    }

    main.page {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 20px;
    }

    .form-container {
      background-color: #ffffff;
      padding: 40px;
      max-width: 400px;
      width: 100%;
      border: 1px solid #e0e0e0;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    h2 {
      text-align: center;
      margin: 0 0 10px 0;
      font-size: 1.75em;
    }

    .subtitle {
      text-align: center;
      margin-bottom: 30px;
      color: #666;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    input {
      padding: 12px;
      font-size: 1em;
      border: 1px solid #ccc;
      box-sizing: border-box;
      width: 100%;
    }

    input:focus {
      outline: none;
      border-color: #e46212;
    }

    button {
      background-color: #e46212;
      color: #fff;
      padding: 12px;
      font-size: 1em;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #dd7535;
    }

    .error-message {
      color: #e74c3c;
      text-align: center;
    }

    .success-message {
      color: #27ae60;
      text-align: center;
    }

    .toggle-link {
      text-align: center;
      margin-top: 20px;
      font-size: 0.9em;
    }

    .toggle-link a {
      color: #e46212;
      cursor: pointer;
      text-decoration: none;
    }

    .toggle-link a:hover {
      text-decoration: underline;
    }
  `;
}
