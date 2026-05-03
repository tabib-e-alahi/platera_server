// src/scripts/seedDemoUsers.ts
//
// Seeds three demo accounts that match the credentials shown on the login page.
// Run with:  npm run seed:demo  (add to package.json scripts)
//
// Uses Better Auth to create users so passwords are hashed identically
// to real sign-ups. Idempotent — safe to run multiple times.

import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import { UserRole } from "../../generated/prisma/enums";

/* ─── Demo accounts ──────────────────────────────────────────────────────── */

const DEMO_USERS = [
  {
    name: "Sarah Rahman",
    email: "sarah.rahman@platera.demo",
    password: "Demo@customer1",
    role: UserRole.CUSTOMER,
    label: "Customer",
  },
  {
    name: "Spice Kitchen",
    email: "kitchen.spice@platera.demo",
    password: "Demo@provider1",
    role: UserRole.PROVIDER,
    label: "Provider",
  },
  {
    name: "Platera Admin",
    email: "admin@platera.demo",
    password: "Demo@admin2024",
    role: UserRole.ADMIN,
    label: "Admin",
  },
] as const;

/* ─── Seed ───────────────────────────────────────────────────────────────── */

const seedDemoUsers = async () => {
  console.log("\n🌱  Seeding demo users…\n");

  for (const user of DEMO_USERS) {
    /* skip if already exists */
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    if (existing) {
      console.log(`⏭   Skipping ${user.label} (${user.email}) — already exists.`);
      continue;
    }

    /* create via Better Auth so the password hash matches real sign-ups */
    const result = await auth.api.signUpEmail({
      body: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
      headers: new Headers({
        "x-intended-role": user.role,
      }),
    });

    if (!result?.user) {
      console.error(`❌  Failed to create ${user.label}: ${user.email}`);
      continue;
    }

    /* bypass email verification for demo accounts */
    await prisma.user.update({
      where: { id: result.user.id },
      data: { emailVerified: true },
    });

    console.log(`✅  Created ${user.label}: ${user.email}`);
  }

  console.log("\n✨  Demo seed complete.\n");
  await prisma.$disconnect();
};

seedDemoUsers().catch((error) => {
  console.error("Demo seed failed:", error);
  process.exit(1);
});