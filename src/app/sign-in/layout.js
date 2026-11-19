import { redirectIfLoggedIn } from "@/lib/session";

const SignInLayout = async ({ children }) => {
    await redirectIfLoggedIn();
    return children;
};

export default SignInLayout;