import express, { Application, Request, Response, NextFunction } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerSetup = (app: Application) => {
  const options = {
    swaggerDefinition: {
      openapi: "3.0.0",
      basePath: "./swagger.ts",
      info: {
        title: "Image API",
        version: "1.0.0",
        description: "Image API",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        security: [
          {
            BearerAuth: [],
          },
        ],
        schemas: {
          UserRegister: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              login: {
                type: "string",
              },
              password: {
                type: "string",
              },
            },
            required: ["name", "login", "password"],
          },
          UserLogin: {
            type: "object",
            properties: {
              login: {
                type: "string",
              },
              password: {
                type: "string",
              },
            },
            required: ["login", "password"],
          },
          PasswordUpdate: {
            type: "object",
            properties: {
              newPassword: {
                type: "string",
              },
              password: {
                type: "string",
              },
            },
            required: ["login", "password"],
          },
          ImageUpload: {
            type: "object",
            properties: {
              filename: {
                type: "string",
              },
              originalname: {
                type: "string",
              },
              size: {
                type: "number",
              },
              mimetype: {
                type: "string",
              },
              createdAt: {
                type: "Date",
              },
            },
            required: [
              "filename",
              "originalname",
              "size",
              "mimetype",
              "createdAt",
            ],
          },
        },
      },
    },
    apis: ["src/image/image.route.ts", "src/user/user.route.ts"], // Substitua pelo caminho do seu arquivo de rotas
  };

  const specs = swaggerJsdoc(options);

  // Adicione o middleware personalizado para adicionar o botão "Authorize" no Swagger UI
  app.use(
    "/api-docs",
    (req: Request, res: Response, next: NextFunction) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      next();
    },
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );

  // Adicione a definição de segurança ao cabeçalho HTML do Swagger UI
  const customCss = `
    <style>
      .swagger-ui .topbar .download-url-wrapper .download-url-button {
        display: none !important;
      }
      .swagger-ui .scheme-container .input-container input[type="text"] {
        width: 100% !important;
      }
    </style>
    <script>
      window.onload = function() {
        const auth = document.createElement("div");
        auth.innerHTML = '<input type="text" id="authToken" placeholder="Bearer token" style="margin: 3px; width: 200px;"><button onclick="applyAuthToken()">Apply</button>';

        const oauth2 = document.createElement("div");
        oauth2.innerHTML = '<a onclick="requestOAuth2Token()">Get OAuth2 Token</a>';

        const container = document.createElement("div");
        container.appendChild(auth);
        container.appendChild(oauth2);

        const ui = SwaggerUIBundle({
          url: "/api-docs",
          dom_id: "#swagger-ui",
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis],
          plugins: [SwaggerUIBundle.plugins.DownloadUrl],
          layout: "StandaloneLayout",
          docExpansion: "none",
          operationsSorter: "alpha",
          onComplete: function() {
            const authInput = document.getElementById("authToken");
            const apiKeyAuth = (window.ui.specs.securityDefinitions || {}).BearerAuth || {};
            const authKey = apiKeyAuth.name || "Authorization";

            function applyAuthToken() {
              const token = authInput.value;
              window.ui.authActions.authorize({ [authKey]: "Bearer " + token });
            }

            function requestOAuth2Token() {
              window.open("<OAuth2 token endpoint URL>", "_blank");
            }

            authInput.addEventListener("keyup", function(event) {
              if (event.keyCode === 13) {
                event.preventDefault();
                applyAuthToken();
              }
            });
          }
        });

        const header = document.createElement("div");
        header.innerHTML = '<h2>Swagger UI</h2>';
        document.body.prepend(header);
        document.body.appendChild(container);
        document.body.appendChild(ui);
      };
    </script>
  `;

  app.get("/api-docs", (req: Request, res: Response) => {
    res.send(customCss);
  });
};

export default swaggerSetup;
