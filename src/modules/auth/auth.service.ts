import { auth } from "../../lib/auth";

interface ICustomerRegisterData {
  name: string
  email: string
  password: string
}

const registerCustomer = async (payload: ICustomerRegisterData) => {
  const { name, email, password } = payload
  const customerData = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password
    },
  });

  if (!customerData.user) {
    throw new Error("Failed to register account.")
  }

  return customerData;
}

export const AuthService = {
  registerCustomer,
}
