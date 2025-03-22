import prisma from "./prisma"
import Fuse from "fuse.js"

// Get search suggestions (autocomplete)
export async function getSearchSuggestions(query: string, limit = 5) {
  if (!query || query.length < 2) {
    return []
  }

  try {
    // Get product names that start with the query
    const products = await prisma.product.findMany({
      where: {
        name: {
          startsWith: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        images: true,
        price: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      take: limit,
    })

    // Get categories that match the query
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: 3,
    })

    // Get brands that match the query
    const brands = await prisma.brand.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        logo: true,
      },
      take: 3,
    })

    return {
      products,
      categories,
      brands,
    }
  } catch (error) {
    console.error("Error getting search suggestions:", error)
    return {
      products: [],
      categories: [],
      brands: [],
    }
  }
}

// Perform fuzzy search
// Add these interfaces at the top of the file
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: {
    name: string;
  };
  brand: {
    name: string;
  };
}

// Update the fuzzy search function
export async function fuzzySearch(
  query: string,
  options: {
    limit?: number;
    threshold?: number;
  } = {},
) {
  const { limit = 20, threshold = 0.4 } = options;

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
      },
    });

    const fuse = new Fuse<Product>(products as Product[], {
      keys: [
        { name: "name", weight: 2 },
        { name: "description", weight: 1 },
        { name: "category.name", weight: 0.8 },
        { name: "brand.name", weight: 0.8 },
      ],
      includeScore: true,
      threshold,
    });

    const results = fuse.search(query);

    return results.slice(0, limit).map((result) => ({
      id: result.item.id,
      name: result.item.name,
      description: result.item.description,
      price: result.item.price,
      category: result.item.category,
      brand: result.item.brand,
      score: result.score,
    }));
  } catch (error) {
    console.error("Error performing fuzzy search:", error);
    return [];
  }
}

