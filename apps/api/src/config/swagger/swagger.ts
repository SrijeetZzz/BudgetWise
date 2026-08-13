import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "BudgetWise API",
      version: "1.0.0",
      description:
        "REST API for the BudgetWise Personal Finance Management System.",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Authentication and account access APIs",
      },
      {
        name: "Profile",
        description: "User profile and account management APIs",
      },
      {
        name: "Categories",
        description: "Category and subcategory APIs",
      },
      {
        name: "Transactions",
        description: "Income, expense and recurring transaction APIs",
      },
      {
        name: "Budgets",
        description: "Budget management and budget engine APIs",
      },
      {
        name: "Dashboard",
        description: "Dashboard and analytics APIs",
      },
      {
        name: "Notifications",
        description: "Notification management APIs",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [
    "./src/modules/**/*.routes.ts",
    "./src/modules/**/routes/*.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(
  swaggerOptions,
);