# Project Documentation: Credit-Analyze-Invoice

## Overview

**Credit-Analyze-Invoice** is a microservice that is part of the ecosystem of **Credit-Analyze-Portal** and **Credit-Analyze-Credit-Engine**. It is responsible for managing the upload of invoices, extracting relevant data for processing, and sending this data for credit analysis to the **Credit-Analyze-Credit-Engine** service. This service was developed using Node.js and TypeScript and is designed to operate in a scalable and secure environment on AWS.

## Key Features

1. **File Reception**: The service accepts invoice files in `.png`, `.jpg`, and `.pdf` formats, received from the frontend.
2. **Storage**: After upload, the files are stored in Amazon S3, ensuring durability and security.
3. **Data Extraction**: Using Amazon Textract, the service extracts critical information from the invoices, such as "Issuer Name," "CPF/CNPJ," "Payment Date," and "Payment Amount."
4. **Data Publication**: The extracted data is published to an SQS queue (`invoice-data-extracted.fifo`) to be consumed by the **Credit-Analyze-Credit-Engine** service for credit analysis.

## Technologies Used

- **Node.js**: JavaScript runtime environment for server-side code execution.
- **TypeScript**: A superset of JavaScript that adds static typing, improving code robustness.
- **Express**: A JavaScript framework that facilitates the creation of RESTful APIs.
- **MongoDB**: NoSQL Database.
- **Amazon S3**: Storage service for invoice files, ensuring data durability and security.
- **Amazon Textract**: A service for automatically extracting text and data from scanned documents.
- **AWS SQS**: Messaging service that enables decoupling between microservices, ensuring scalability and resilience.


## Configuration

The **Credit-Analyze-Invoice** service requires several environment variables for proper operation. These should be stored in a `.env` file in the root of the project:

```plaintext
#PORT
PORT=

#MONGO
MONGO_URL=

#AWS
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### 🤝 Contributors

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/88459755?v=4" width="100px;" border-radius='50%' alt="Diogo Gallina's photo on GitHub"/><br>
        <sub>
          <b>Diogo Gallina</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

