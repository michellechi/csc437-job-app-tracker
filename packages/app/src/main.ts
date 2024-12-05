import { Auth, define, History, Store, Switch } from "@calpoly/mustang";
import { html, LitElement } from "lit";

import { HeaderElement } from "./components/header";
import { HomeViewElement } from "./views/home-view";
import { RecipeViewElement } from "./views/recipe-view";
import { RecipeSearchViewElement } from "./views/recipe-search-view.ts";
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
        "recipe-view": RecipeViewElement,
        "login-view": LoginViewElement,
        "recipe-search-view": RecipeSearchViewElement,
        "about-view": AboutViewElement,
        "application-view": ApplicationViewElement,
        "application-search-view": ApplicationSearchViewElement,

        "mu-store": class AppStore extends Store.Provider<Model,
            Msg> {
            constructor() {
                super(update, init, "guru:auth");
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
        path: "/app/recipes/:id",
        view: (params: Switch.Params) => html`
            <recipe-view itemId="${params.id}"></recipe-view>
        `
    },
    {
        path: "/app/login",
        view: () => html`
            <login-view></login-view>`
    },
    {
        path: "/app/recipe-search-view",
        view: () => html`
            <recipe-search-view></recipe-search-view>
        `
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
            super(update, { cartItems: [], companys: [], totalCost: 0,  recipes:[], applications:[]}, "guru:auth");
        }
    },
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "guru:history", "guru:auth");
        }
    },
    "grocery-guru-app": AppElement,
    "all-header": HeaderElement,
    "recipe-view": RecipeViewElement,
    "application-view": ApplicationViewElement
});