// @ts-ignore
import { css, html, LitElement } from "lit";
// @ts-ignore
import { state } from "lit/decorators.js";

export class LoginViewElement extends LitElement {
  @state()
  username: string = "";

  @state()
  password: string = "";

  @state()
  confirmPassword: string = ""; // For registration

  @state()
  errorMessage: string = "";

  @state()
  successMessage: string = "";

  @state()
  isRegister: boolean = false; // Toggles between Login and Register views

  // Handles the login logic
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

  // Handles the registration logic
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

  // Toggles between login and registration views
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
          <h3>${this.isRegister ? "Register" : "Log in"}</h3>
          
          <!-- Display error or success messages -->
          ${this.errorMessage
            ? html`<p class="error-message">${this.errorMessage}</p>`
            : ""}
          ${this.successMessage
            ? html`<p class="success-message">${this.successMessage}</p>`
            : ""}

          <!-- Form for login or registration -->
          <form @submit="${(e: Event) => e.preventDefault()}">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                .value="${this.username}"
                @input="${(e: Event) =>
                  (this.username = (e.target as HTMLInputElement).value)}"
                required
                aria-describedby="username-help"
              />
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                .value="${this.password}"
                @input="${(e: Event) =>
                  (this.password = (e.target as HTMLInputElement).value)}"
                required
                aria-describedby="password-help"
              />
            </div>

            ${this.isRegister
              ? html`
                  <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      .value="${this.confirmPassword}"
                      @input="${(e: Event) =>
                        (this.confirmPassword = (
                          e.target as HTMLInputElement
                        ).value)}"
                      required
                      aria-describedby="confirm-password-help"
                    />
                  </div>
                `
              : ""}

            <button
              @click="${this.isRegister
                ? this.handleRegister
                : this.handleLogin}"
              aria-label="${this.isRegister ? 'Register' : 'Login'}"
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
      height: 100%
      background-color: #f7f7f7;
      font-family: 'Arial', sans-serif;
    }

    main.page {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
    }

    .form-container {
      max-width: 400px;
      width: 100%;
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
      margin-top: 100px;
    }

    h3 {
      text-align: center;
      margin-bottom: 25px;
      font-size: 1.5em;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      font-weight: bold;
      margin-bottom: 5px;
      display: block;
      color: #333;
    }

    input {
      width: calc(100% - 20px);
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }

    button {
      width: 100%;
      padding: 12px;
      background-color: #e46212;
      color: #fff;
      font-size: 1em;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #dd7535;
    }

    p.toggle-link {
      text-align: center;
      margin-top: 20px;
    }

    p.toggle-link a {
      color: #007bff;
      text-decoration: none;
    }

    .error-message {
      color: #f44336;
      text-align: center;
      margin-bottom: 10px;
    }

    .success-message {
      color: #4caf50;
      text-align: center;
      margin-bottom: 10px;
    }
  `;
}
