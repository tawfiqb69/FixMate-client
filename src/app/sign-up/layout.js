import { redirectIfLoggedIn } from "@/lib/session";

const SignUpLayout = async ({ children }) => {
    await redirectIfLoggedIn();
    return children;
};

export default SignUpLayout;