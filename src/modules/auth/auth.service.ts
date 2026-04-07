import { userAccountStatus } from "../../../generated/prisma/enums";
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

interface ILoginData {
  email: string
  password: string
}

const loginUser = async (payload: ILoginData) => {
  const { email, password } = payload;

  const loginData = await auth.api.signInEmail({
    body: { email, password },
  });

  if (loginData.user.status === userAccountStatus.SUSPENDED) {
    throw new Error("Your account has been suspended. Please contact support for assistance.")
  }

  if (loginData.user.status === userAccountStatus.DELETED) {
    throw new Error("Your account has been deleted. Please contact support for assistance.")
  }

  return loginData;
};

export const AuthService = {
  registerCustomer,
  loginUser
}
