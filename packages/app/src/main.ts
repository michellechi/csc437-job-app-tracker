import {Auth, define, History, Store, Switch} from "@calpoly/mustang";
import {html, LitElement} from "lit";

import {HeaderElement} from "./components/header";
import {HomeViewElement} from "./views/home-view";
import {RecipeViewElement} from "./views/recipe-view";
import {SearchViewElement} from "./views/search-view";
import {AboutViewElement} from "./views/about-view.ts";
import {LoginViewElement} from "./views/login-view";

import {Msg} from "./messages";
import {Model, init} from "./model";
import update from "./update";

class AppElement extends LitElement {
    static uses = define({
        "home-view": HomeViewElement,
        "recipe-view": RecipeViewElement,
        "login-view": LoginViewElement,
        "search-view": SearchViewElement,
        "about-view": AboutViewElement,

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
        path: "/app/search-view",
        view: () => html`
            <search-view></search-view>
        `
    },
    {
        path: "/app/about-view",
        view: () => html`
            <about-view></about-view>
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
            super(update, { cartItems: [], companys: [], totalCost: 0,  recipes:[]}, "guru:auth");
        }
    },
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "guru:history", "guru:auth");
        }
    },
    "grocery-guru-app": AppElement,
    "all-header": HeaderElement,
    "recipe-view": RecipeViewElement
});