import { requireRole } from "@/lib/session";

const PaymentLayout = async ({ children }) => {
  await requireRole("customer");
  return children;
};

export default PaymentLayout;