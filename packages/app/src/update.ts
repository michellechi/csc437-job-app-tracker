// @ts-ignore
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { CartItem, Model} from "./model";

export default function update(
    message: Msg,
    apply: Update.ApplyMap<Model>,
    user: Auth.User
) {
    switch (message[0]) {
        case "companys/load":
            fetchCompanys(user)
                .then((companys) =>
                    apply((model) => ({
                        ...model,
                        companys,
                    }))
                )
                .catch((error) => {
                    console.error("Failed to fetch companys:", error);
                });
            break;

            // searches for the cheapest item closest to keyword
        case "search/item":
            const { query } = message[1];
            apply((model) => {
                const lowerCaseQuery = query.toLowerCase();
                let cheapestItem = null as CartItem | null;
                model.companys.forEach((company) => {
                    company.items.forEach((item) => {
                        if (item.name.toLowerCase().includes(lowerCaseQuery)) {
                            if (!cheapestItem || item.price < cheapestItem.price) {
                                cheapestItem = {
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    companyName: company.name,
                                };
                            }
                        }
                    });
                });

                if (cheapestItem !== null) {
                    return {
                        ...model,
                        cartItems: [...model.cartItems, cheapestItem],
                        totalCost: model.totalCost + cheapestItem.price,
                    };
                } else {
                    console.warn(`No items found for query: ${query}`);
                    return model; // No updates if no item matches
                }
            });
            break;

        case "recipes/search":
            console.log("DISPATCHING SEARCH QUERY:", message[1].query);
            handleRecipeSearch(message[1].query, apply, user);
            break;

        case "cart/add":
            apply((model) => ({
                ...model,
                cartItems: [...model.cartItems, message[1].item],
                totalCost: model.totalCost + message[1].item.price,
            }));
            break;
        
            case "cart/removeItem":
                const { itemId } = message[1];
                apply((model) => {
                    // Find the index of the first item with the matching ID
                    const itemIndex = model.cartItems.findIndex((item) => item.id === itemId);
                    if (itemIndex !== -1) {
                        // Create a new cart array without the specified item
                        const updatedCart = [...model.cartItems];
                        const [removedItem] = updatedCart.splice(itemIndex, 1);
                        // Update the total cost
                        const updatedTotalCost = model.totalCost - removedItem.price * (removedItem.quantity || 1);
                        return {
                            ...model,
                            cartItems: updatedCart,
                            totalCost: updatedTotalCost,
                        };
                    }
                    // If no matching item is found, return the unchanged model
                    return model;
                });
                break;
    

        default:
            const unhandled: never = message[0];
            throw new Error(`Unhandled Auth message "${unhandled}"`);
    }
}

function fetchCompanys(user: Auth.User): Promise<Model["companys"]> {
    return fetch("/api/companys", {
        headers: Auth.headers(user),
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Unauthorized: User must log in.");
                }
                throw new Error(`API error: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            if (Array.isArray(data)) {
                return data as Model["companys"];
            } else {
                throw new Error("Unexpected response format");
            }
        });
}

function handleRecipeSearch(
    query: string,
    apply: Update.ApplyMap<Model>,
    user: Auth.User
) {
    fetchRecipes(user)
        .then((recipes) => {
            console.log("FETCHED RECIPES: ", recipes);
            const lowerCaseQuery = query.toLowerCase();
            const filteredRecipes = recipes.filter((recipe) =>
                recipe.name.toLowerCase().includes(lowerCaseQuery)
            );
            apply((model) => ({
                ...model,
                recipes: filteredRecipes,
            }));
        })
        .catch((error) => {
            console.error("Failed to fetch recipes:", error);
        });
}

function fetchRecipes(user: Auth.User): Promise<Model["recipes"]> {
    return fetch("/api/recipes", {
        headers: Auth.headers(user),
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Unauthorized: User must log in.");
                }
                throw new Error(`API error: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            if (Array.isArray(data)) {
                return data as Model["recipes"];
            } else {
                throw new Error("Unexpected response format");
            }
        });
}
