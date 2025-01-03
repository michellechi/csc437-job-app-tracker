// @ts-ignore
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Application } from "./model";

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

        case "applications/add":
            const [_, { title, company, appliedDate, status, method, notes }] = message;
            const newApplication = {
                id: Math.random().toString(36).substr(2, 9), 
                title,
                company,
                appliedDate,
                status,
                method,
                notes
            };
            apply((model) => ({
                ...model,
                applications: [...model.applications, newApplication],
            }));
            break;

        case "application/save":
            saveApplication(message[1], user)
            .then((application) => apply((model) => ({ ...model, application })))
            .then(() => {
                const { onSuccess } = message[1];
                if (onSuccess) onSuccess();
            })
            .catch((error: Error) => {
                const { onFailure } = message[1];
                if (onFailure) onFailure(error);
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

function saveApplication(
    msg: {
      applicationId: string;
      application: Application;
    },
    user: Auth.User
  ) {
    return fetch(`/api/applications/${msg.applicationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...Auth.headers(user),
      },
      body: JSON.stringify(msg.application),
    })
      .then((response: Response) => {
        if (response.status === 200) return response.json();
        else
          throw new Error(
            `Failed to save application with ID ${msg.applicationId}`
          );
      })
      .then((json: unknown) => {
        if (json) return json as Application;
        return undefined;
      });
  }
