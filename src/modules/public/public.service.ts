import { prisma } from "../../lib/prisma"

const getCategories = async () => {
  const result = await prisma.category.findMany({
    where: {
      isActive: {
        not: false
      }
    }
  });

  return result
}

export const PublicService = {
  getCategories
}