import { requireRole } from '@/lib/session';

const TechnicianLayout = async({ children }) => {
    await requireRole("technician");
    return children;
};

export default TechnicianLayout;