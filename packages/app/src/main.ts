import { Auth, define, History, Store, Switch } from "@calpoly/mustang";
import { html, LitElement } from "lit";

import { HeaderElement } from "./components/header";
import { HomeViewElement } from "./views/home-view";
import { AboutViewElement } from "./views/about-view.ts";
import { LoginViewElement } from "./views/login-view";
import { ApplicationViewElement } from "./views/application-view.ts";
import { ApplicationSearchViewElement } from "./views/application-search-view.ts";

import {Msg} from "./messages";
import {Model, init} from "./model";
import update from "./update";

class AppElement extends LitElement {
    static uses = define({
        "home-view": HomeViewElement,
        "login-view": LoginViewElement,
        "about-view": AboutViewElement,
        "application-view": ApplicationViewElement,
        "application-search-view": ApplicationSearchViewElement,

        "mu-store": class AppStore extends Store.Provider<Model,
            Msg> {
            constructor() {
                super(update, init, "apptrak:auth");
            }
        }
    });

    render() {
        return html`
            <mu-switch></mu-switch>`;
    }

    connectedCallback(): void {
        super.connectedCallback();
    }
}

const routes = [
    {
        path: "/app/login",
        view: () => html`
            <login-view></login-view>`
    },
    {
        path: "/app/about-view",
        view: () => html`
            <about-view></about-view>
        `
    },
    {
        path: "/app/applications/:id",
        view: (params: Switch.Params) => html`
            <application-view itemId="${params.id}"></application-view>
        `
    },
    {
        path: "/app/application-search-view",
        view: () => html`
            <application-search-view></application-search-view>
        `
    },
    {
        path: "/app/add-application",
        view: () => html`
            <application-add-view></application-add-view>
        `
    },    
    {
        path: "/app",
        view: () => html`
            <home-view></home-view>
        `
    },
    {
        path: "/",
        redirect: "/app"
    }
];


define({
    "mu-auth": Auth.Provider,
    "mu-history": History.Provider,
    "mu-store": class AppStore extends Store.Provider<Model, Msg> {
        constructor() {
            super(update, { companys: [], totalCost: 0, applications:[] }, "apptrak:auth");
        }
    },
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "apptrak:history", "apptrak:auth");
        }
    },
    "apptrak-app": AppElement,
    "all-header": HeaderElement,
    "application-view": ApplicationViewElement
});