import { Response, createRouter } from "fets";
import { App, HttpRequest, HttpResponse } from "uWebSockets.js";
import pino from "pino";

const L = pino({
  transport: {
    target: "pino-pretty",
  },
});

interface ServerContext {
  req: HttpRequest;
  res: HttpResponse;
}

const router = createRouter<ServerContext>().route({
  method: "GET",
  path: "/greetings",
  schemas: {
    responses: {
      200: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
        },
        required: ["message"],
        additionalProperties: false,
      },
    },
  } as const,
  handler: async () => {
    L.info("I'm greeting");
    return Response.json({ message: "Hello, world!" });
  },
});

App()
  .any("/*", router)
  .listen(3000, () => {
    L.info(`Swagger UI is running on http://localhost:3000/docs`);
  });
