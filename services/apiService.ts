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
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching groups:", (error as any).message);
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
	console.log(response.data);
	return response;
}
