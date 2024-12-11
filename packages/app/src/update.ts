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
    
        case "applications/search":
            console.log("DISPATCHING SEARCH QUERY:", message[1].query);
            handleApplicationSearch(message[1].query, apply, user);
            break;
        
        case "applications/delete":
            const { id } = message[1];
            apply((model) => {
                const updatedApplications = model.applications.filter(
                    (application) => application.id !== id
                );
                return {
                    ...model,
                    applications: updatedApplications,
                };
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

function handleApplicationSearch(
    query: string,
    apply: Update.ApplyMap<Model>,
    user: Auth.User
) {
    fetchApplications(user)
        .then((applications) => {
            console.log("FETCHED APPLICATIONS: ", applications);
            const lowerCaseQuery = query.toLowerCase();
            const filteredApplications = applications.filter((application) =>
                application.title.toLowerCase().includes(lowerCaseQuery)
            );
            apply((model) => ({
                ...model,
                applications: filteredApplications,
            }));
        })
        .catch((error) => {
            console.error("Failed to fetch applications:", error);
        });
}
