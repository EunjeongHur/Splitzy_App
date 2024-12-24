export const handleAuthError = (
	error: any,
	setToken: (token: string | null) => void
): boolean => {
	if (error.message === "Unauthorized") {
		setToken(null);
		alert("Your session is expired. Please log in again.");
		return true;
	}
	return false;
};
