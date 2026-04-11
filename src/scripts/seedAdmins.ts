// src/scripts/seedAdmins.ts
import envConfig from "../config";
import { prisma } from "../lib/prisma";
import { UserRole } from "../../generated/prisma/enums";
import { auth } from "../lib/auth";

const admins = [
  {
    name: envConfig.SUPER_ADMIN_NAME,
    email: envConfig.SUPER_ADMIN_EMAIL,
    password: envConfig.SUPER_ADMIN_PASSWORD,
    role: UserRole.SUPER_ADMIN,
  },
  {
    name: envConfig.ADMIN_NAME,
    email: envConfig.ADMIN_EMAIL,
    password: envConfig.ADMIN_PASSWORD,
    role: UserRole.ADMIN,
  },
];

const seedAdmins = async () => {
  console.log("Seeding admin accounts...");

  for (const admin of admins) {
    const existing = await prisma.user.findUnique({
      where: { email: admin.email },
      select: { id: true },
    });

    if (existing) {
      console.log(`Skipping ${admin.email} — already exists.`);
      continue;
    }

    // use Better Auth to create — ensures password is hashed
    // the same way as regular users
    const result = await auth.api.signUpEmail({
      body: {
        name: admin.name,
        email: admin.email,
        password: admin.password,
      },
      headers: new Headers({
        "x-intended-role": admin.role,
      }),
    });

    if (!result.user) {
      console.error(`Failed to create ${admin.email}`);
      continue;
    }

    // admins bypass email verification
    await prisma.user.update({
      where: { id: result.user.id },
      data: { emailVerified: true },
    });

    console.log(`Created ${admin.role}: ${admin.email}`);
  }

  console.log("Seeding complete.");
  await prisma.$disconnect();
};

seedAdmins().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});