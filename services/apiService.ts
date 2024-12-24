import api from "../utils/api";
import { AxiosError } from "axios";

export interface Group {
	id: number;
	name: string;
	total: number;
}

/**
 * Handles Axios errors by extracting the status and message.
 * @param error - The error object thrown by Axios.
 * @throws An error with a meaningful message based on the status code.
 */
const handleAxiosError = (error: unknown) => {
	const axiosError = error as AxiosError;

	if (axiosError.response) {
		const status = axiosError.response.status;
		const data = axiosError.response.data as { message?: string };
		const message = data?.message || axiosError.message;

		switch (status) {
			case 401:
				throw new Error("Unauthorized");
			case 403:
				throw new Error("Forbidden");
			default:
				throw new Error(message || "Unknown error occurred");
		}
	} else {
		throw new Error((axiosError.message || "Network error").toString());
	}
};

/**
 * Fetches the list of groups for the authenticated user.
 * @param token - The authentication token.
 * @returns A promise resolving to an array of groups.
 */
export const fetchGroups = async (token: string): Promise<Group[]> => {
	try {
		const response = await api.get<Group[]>("/groups", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError;

		if (axiosError.response) {
			const status = axiosError.response.status;
			if (status === 401) {
				console.error("Unauthorized: Token expired or invalid.");
				throw new Error("Unauthorized");
			} else if (status === 403) {
				console.error("Forbidden: Access denied.");
				throw new Error("Forbidden");
			}
		}

		console.error("Error fetching groups:", axiosError.message);
		throw error;
	}
};

/**
 * Registers a new user.
 * @param fname - First name of the user.
 * @param lname - Last name of the user.
 * @param username - Desired username.
 * @param email - Email address of the user.
 * @param password - Password for the account.
 * @returns A promise resolving to the API response.
 */
export const signUp = async (
	fname: string,
	lname: string,
	username: string,
	email: string,
	password: string
) => {
	const response = await api.post("/auth/signup", {
		fname,
		lname,
		username,
		email,
		password,
	});
	return response.data;
};

/**
 * Authenticates a user and logs them in.
 * @param email - Email address of the user.
 * @param password - User's password.
 * @returns A promise resolving to the login response.
 */
export const login = async (email: string, password: string) => {
	const response = await api.post("/auth/login", { email, password });
	return response.data;
};

/**
 * Logs out the currently authenticated user.
 * @returns A promise resolving to true if logout was successful.
 */
export const logout = async () => {
	const response = await api.get("/auth/logout");
	return response.status === 200;
};

/**
 * Fetches information about the authenticated user.
 * @param token - The authentication token.
 * @returns A promise resolving to the user's information.
 */
export const fetchUserInformation = async (token: string) => {
	try {
		const response = await api.get("/users/getUserInformation", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data[0];
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Updates the user's personal information.
 * @param token - The authentication token.
 * @param updateInfo - An object containing updated user information.
 * @returns A promise resolving to the API response.
 */
export const updateUserInformation = async (
	token: string,
	updateInfo: {
		firstName: string;
		lastName: string;
		email: string;
		username: string;
	}
) => {
	try {
		const response = await api.put(
			"/users/updateUserInformation",
			updateInfo,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Searches for users based on a query string.
 * @param token - The authentication token.
 * @param query - The search query.
 * @returns A promise resolving to the list of matching users.
 */
export const searchUsers = async (token: string, query: string) => {
	try {
		const response = await api.get("/users/search", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params: { query },
		});
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Sends an invitation to join a group.
 * @param token - The authentication token.
 * @param groupName - Name of the group.
 * @param invitedUsers - List of user IDs to invite.
 * @returns A promise resolving to the API response.
 */
export const sendGroupInvitation = async (
	token: string,
	groupName: string,
	invitedUsers: Number[]
) => {
	try {
		const response = await api.post(
			"/groups",
			{ groupName, invitedUsers },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Deletes a specified group.
 * @param groupId - The ID of the group to delete.
 * @param token - The authentication token.
 * @returns A promise resolving to the API response.
 */
export const deleteGroup = async (groupId: number, token: string) => {
	try {
		const response = await api.delete(`/groups/${groupId}/delete`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Adds a new expense to a group.
 * @param group_id - ID of the group.
 * @param token - The authentication token.
 * @param amount - Expense amount.
 * @param description - Description of the expense.
 * @param selectedPaidBy - User ID of the person who paid.
 * @returns A promise resolving to the API response.
 */
export const addExpense = async (
	group_id: number,
	token: string,
	amount: number,
	description: string,
	selectedPaidBy: number
) => {
	try {
		const response = await api.post(
			"/expenses",
			{ group_id, amount, description, selectedPaidBy },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};
/**
 * Fetches the details of a specific group.
 * @param groupId - The ID of the group.
 * @returns A promise resolving to the group's details.
 */
export const fetchGroupDetails = async (groupId: number) => {
	try {
		const response = await api.get(`/groups/${groupId}`);
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Fetches the members of a specific group.
 * @param groupId - The ID of the group.
 * @returns A promise resolving to the list of group members.
 */
export const fetchGroupMembers = async (groupId: number) => {
	try {
		const response = await api.get(`/groups/${groupId}/members`);
		return response.data.members;
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Settles up expenses for a specific group.
 * @param groupId - The ID of the group.
 * @param token - The authentication token.
 * @returns A promise resolving to the settlement details.
 */
export const settleUp = async (groupId: number, token: string) => {
	try {
		const response = await api.get(`/settle/${groupId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Fetches the settlement details for a group.
 * @param groupId - The ID of the group.
 * @param token - The authentication token.
 * @returns A promise resolving to the settlement details.
 */
export const fetchSettlementDetails = async (
	groupId: number,
	token: string
) => {
	try {
		const response = await api.get(`/settle/${groupId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Settles a specific transaction.
 * @param settlementId - The ID of the settlement transaction.
 * @param token - The authentication token.
 * @returns A promise resolving to the API response.
 */
export const settleTransaction = async (
	settlementId: number,
	token: string
) => {
	try {
		const response = await api.put(
			`/settle/${settlementId}/settle`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Reverts a specific settlement transaction.
 * @param settlementId - The ID of the settlement transaction.
 * @param token - The authentication token.
 * @returns A promise resolving to the API response.
 */
export const undoTransaction = async (settlementId: number, token: string) => {
	try {
		const response = await api.put(
			`/settle/${settlementId}/undo`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};

/* Invitation API */

/**
 * Fetches all invitations for the authenticated user.
 * @param token - The authentication token.
 * @returns A promise resolving to the list of invitations.
 */
export const fetchInvitations = async (token: string) => {
	try {
		const response = await api.get("/invitations", {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Fetches the count of pending invitations for the authenticated user.
 * @param token - The authentication token.
 * @returns A promise resolving to the number of pending invitations.
 */
export const fetchInvitationCount = async (token: string) => {
	try {
		const response = await api.get("/invitations/count", {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data[0].count;
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Accepts an invitation to join a group.
 * @param invitationId - The ID of the invitation.
 * @param groupId - The ID of the group associated with the invitation.
 * @param token - The authentication token.
 * @returns A promise resolving to the API response.
 */
export const acceptInvitation = async (
	invitationId: number,
	groupId: number,
	token: string
) => {
	try {
		const response = await api.post(
			`/invitations/${invitationId}/${groupId}/accept`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};

/**
 * Declines an invitation to join a group.
 * @param invitationId - The ID of the invitation.
 * @param token - The authentication token.
 * @returns A promise resolving to the API response.
 */
export const declineInvitation = async (
	invitationId: number,
	token: string
) => {
	try {
		const response = await api.post(
			`/invitations/${invitationId}/decline`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
};
