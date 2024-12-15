import api from "../utils/api";

// Types
export interface Group {
	id: number;
	name: string;
	total: number;
}

// Fetch all groups
export const fetchGroups = async (): Promise<Group[]> => {
	try {
		const response = await api.get<Group[]>("/groups");
		return response.data;
	} catch (error) {
		console.error("Error fetching groups:", (error as any).message);
		throw error;
	}
};

// Create a new group
export const createGroup = async (name: string): Promise<Group> => {
	try {
		const response = await api.post<Group>("/groups", { name });
		return response.data;
	} catch (error) {
		console.error("Error creating group:", (error as any).message);
		throw error;
	}
};

export const testing = async () => {
	try {
		const response = await api.get("/testing");
		console.log(response.data);
	} catch (error) {
		console.error("Error fetching test:", (error as any).message);
		throw error;
	}
};

export const signUp = async (name: string, email: string, password: string) => {
	const response = await api.post("/auth/signup", { name, email, password });
	return response.data;
};

export const login = async (email: string, password: string) => {
	const response = await api.post("/auth/login", { email, password });
	console.log(response.data);
	console.log(response);
	return response.data; // { token, user }
};
