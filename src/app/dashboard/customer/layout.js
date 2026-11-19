import { requireRole } from '@/lib/session';

const CustomerLayout = async({ children }) => {
    await requireRole("customer");
    return children;
};

export default CustomerLayout;