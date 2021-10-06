# Document Management System

Original [Document Management System](https://github.com/phwt/DMS) (Django, JavaScript) rewritten in React / Next.js and deployed on AWS

A large organization is made up of numerous departments. Each department is responsible for storing its own documents, resulting in a large number of documents in the organization. As a result, document management and standardization become more complex, because each department has its own document management process, as well as its own document standard. Document Management System will function as a centralized system, streamlining the document management process.

![dashboard-crop](https://user-images.githubusercontent.com/28344318/122898292-f5e49f00-d374-11eb-9dd7-157f2ebe67e3.jpeg)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fphwt%2FDMS-AWS.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fphwt%2FDMS-AWS?ref=badge_shield)

## Objectives

- Streamlining the document management process (create, edit, cancel)
- Maintaining single document standards throughout the organization
- Easing employee document retrieval and management
- Centralizing system for use by all departments in the organization

## Technology used

- **Development**
  - [React](https://reactjs.org/)
    - [Next.js](https://nextjs.org/)
    - [NextAuth](https://next-auth.js.org/)
    - [React Bootstrap](https://react-bootstrap.github.io/)
    - [next-connect](https://github.com/hoangvvo/next-connect)
  - [Prisma](https://www.prisma.io/)
  - [TypeScript](http://typescriptlang.org/)
- **Deployment**
  - [Amazon Web Services](https://aws.amazon.com/)
    - Elastic Container Service (ECS)
    - Elastic Container Registry (ECR)
    - Simple Storage Services (S3)
    - Relational Database Service (RDS)
    - Application Load Balancer (ALB)
    - Cognito
  - [Docker](https://www.docker.com/)
  - [Terraform](https://www.terraform.io/)

## Development setup

1. Create `.env` file from [`.env.example`](https://github.com/phwt/DMS-AWS/blob/main/.env.example)
2. Install required dependencies
   ```zsh
   npm install
   ```
3. Start development server
   ```zsh
   npm run dev
   ```


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fphwt%2FDMS-AWS.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fphwt%2FDMS-AWS?ref=badge_large)