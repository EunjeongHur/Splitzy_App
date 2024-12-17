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


export const signUp = async (name: string, email: string, password: string) => {
	const response = await api.post("/auth/signup", { name, email, password });
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

export const createGroup = async (groupName: string, memberIds: number[]) => {
	const response = await api.post("/groups", { groupName, memberIds });
	return response.data;
};

export const getFriends = async (userId: number) => {
	const response = await api.get(`/friends/${userId}`);
	return response;
}

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
	const response = await api.get(`/groups/${groupId}`);
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