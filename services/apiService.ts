import api from "../utils/api";

export interface Group {
	id: number;
	name: string;
	total: number;
}

export const fetchGroups = async (token: string): Promise<Group[]> => {
	try {
		const response = await api.get<Group[]>("/groups", {
			headers: {
				Authorization: `Bearer ${token}`,
			}
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching groups:", (error as any).message);
		if ((error as any).status === 401) {
			throw new Error("Unauthorized");
		}
		throw error;
	}
};


export const signUp = async (fname: string, lname: string, username: string, email: string, password: string) => {
	const response = await api.post("/auth/signup", { fname, lname, username, email, password });
	return response.data;
};

export const login = async (email: string, password: string) => {
	const response = await api.post("/auth/login", { email, password });
	return response.data;
};

export const logout = async () => {
	const response = await api.get("/auth/logout");
	return response.status === 200;
};

// export const createGroup = async (groupName: string, memberIds: number[]) => {
// 	const response = await api.post("/groups", { groupName, memberIds });
// 	return response.data;
// };

export const searchUsers = async (token: string, query: string) => {
	const response = await api.get(
        "/users/search",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
			params: {
				query,
			},
        }
    );
	return response.data;
}

export const sendGroupInvitation = async (token: string, groupName: string, invitedUsers: Number[]) => {
	const response = await api.post("/groups", {groupName, invitedUsers}, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}


// export const getFriends = async (userId: number) => {
// 	const response = await api.get(`/friends/${userId}`);
// 	return response;
// }

export const addExpense = async (group_id: number, token: string, amount: number, description: string, selectedPaidBy: number) => {
    const response = await api.post(
        "/expenses",
        { group_id, amount, description, selectedPaidBy },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const fetchGroupDetails = async (groupId: number) => {
	const response = await api.get(`/groups/${groupId}`,
	);
	return response.data;
}

export const fetchGroupMembers = async (groupId: number) => {
	const response = await api.get(`/groups/${groupId}/members`);
	return response.data.members;
}

export const settleUp = async (groupId: number, token: string) => {
    const response = await api.get(`/settle/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchSettlementDetails = async (groupId: number, token: string) => {
    const response = await api.get(`/settle/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const settleTransaction = async (settlementId: number, token: string) => {
	const response = await api.put(`/settle/${settlementId}/settle`, {}, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
}

export const undoTransaction = async (settlementId: number, token: string) => {
	const response = await api.put(`/settle/${settlementId}/undo`, {}, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
}

/* Invitation API */
// Fetch Invitations
export const fetchInvitations = async (token: string) => {
    const response = await api.get("/invitations", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Accept an invitation
export const acceptInvitation = async (invitationId: number, groupId: number, token: string) => {
	console.log(invitationId);
    const response = await api.post(`/invitations/${invitationId}/${groupId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Decline an invitation
export const declineInvitation = async (invitationId: number, token: string) => {
    const response = await api.post(`/invitations/${invitationId}/decline`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};