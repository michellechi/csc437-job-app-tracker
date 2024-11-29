// @ts-ignore
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";

export default function update(
    message: Msg,
    apply: Update.ApplyMap<Model>,
    user: Auth.User
) {
    switch (message[0]) {
        case "applications/load":
            fetchApplications(user)
                .then((applications) =>
                    apply((model) => ({
                        ...model,
                        applications,
                    }))
                )
                .catch((error) => {
                    console.error("Failed to fetch applications:", error);
                });
            break;
            // searches for the cheapest item closest to keyword
        case "search/item":
            const { query } = message[1];
            apply((model) => {
                const lowerCaseQuery = query.toLowerCase();
                let cheapestItem: { name: string; price: number; applicationName: string } | null = null;
                model.applications.forEach((application) => {
                    application.items.forEach((item) => {
                        if (item.name.toLowerCase().includes(lowerCaseQuery)) {
                            if (!cheapestItem || item.price < cheapestItem.price) {
                                cheapestItem = {
                                    name: item.name,
                                    price: item.price,
                                    applicationName: application.name,
                                };
                            }
                        }
                    });
                });
                if (cheapestItem) {
                    console.log(`Adding to cart: ${cheapestItem.name} from ${cheapestItem.applicationName}`);
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
        case "cart/add":
            apply((model) => ({
                ...model,
                cartItems: [...model.cartItems, message[1].item],
                totalCost: model.totalCost + message[1].item.price,
            }));
            break;
        default:
            const unhandled: never = message[0];
            throw new Error(`Unhandled Auth message "${unhandled}"`);
    }
}

function fetchApplications(user: Auth.User): Promise<Model["applications"]> {
    return fetch("/api/applications", {
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
                return data as Model["applications"];
            } else {
                throw new Error("Unexpected response format");
            }
        });
}