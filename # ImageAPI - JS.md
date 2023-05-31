# ImageAPI

## Stack

- Backend
    - Express //feito
    - Helmet //feito
    - PrismaORM (https://www.prisma.io) //feito
    - Multer (https://blog.logrocket.com/multer-nodejs-express-upload-file/) //feito
    - dotenv (opcional) //feito

- Database
    - Postgres //feito
    - DBeaver //feito

- Frontend
  - React //feito
  - Axios //feito
  - ChakraUI (https://chakra-ui.com/docs/components) (opcional) //feito
  - Carousel (https://sahilsaha.me/react-carousel-minimal-demo/) //feito
  - localStorage //feito
  - fs (download imagens ) //feito

## Estrutura de Pastas

### Express (Typescript)

- prisma
  - schema.prisma
- src
    - app.ts
    - user
      - dto
        - create-user.dto.ts
        - update-user-password.dto.ts
      - user.route.ts
      - user.controller.ts
      - user.service.ts
    - image
      - dto
        - create-image.dto.ts
        - update-image.dto.ts
      - image.route.ts
      - image.controller.ts
      - image.service.ts
    -> helpers
        -> delay.ts