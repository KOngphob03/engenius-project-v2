import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";

import { authRoutes } from "./interface/http/routes/auth.routes";
import { paymentRoutes } from "./interface/http/routes/payment.routes";
import { usersRoutes } from "./interface/http/routes/users.routes";

const app = new Elysia()
  .use(openapi({
    path: "/openapi",
    documentation: {
      info: {
        title: "Engenius API",
        version: "1.0.0",
        description: "Tax Invoice System API",
      },
    },
  }))
  .use(authRoutes)
  .use(paymentRoutes)
  .use(usersRoutes)
  .get("/", () => "Engenius API is running!")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `📚 OpenAPI documentation at http://localhost:3000/openapi`
);
