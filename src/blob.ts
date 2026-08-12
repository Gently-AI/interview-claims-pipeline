import { ContainerClient } from "@azure/storage-blob";
import {
  AZURE_CONTAINERS,
  AZURITE_ACCOUNT,
  AZURITE_KEY,
  BLOB_ENDPOINT,
  USE_AZURITE,
  assertBlobCredentials,
  containerUrl,
} from "./config.js";

/** A client for a single container. */
export function getContainerClient(container: string): ContainerClient {
  assertBlobCredentials();

  if (USE_AZURITE) {
    const conn =
      `DefaultEndpointsProtocol=http;AccountName=${AZURITE_ACCOUNT};` +
      `AccountKey=${AZURITE_KEY};BlobEndpoint=${BLOB_ENDPOINT};`;
    return new ContainerClient(conn, container);
  }

  return new ContainerClient(containerUrl(container));
}

/** Clients for each configured container, paired with its name. */
export function getAllContainerClients(): { container: string; client: ContainerClient }[] {
  return AZURE_CONTAINERS.map((container) => ({
    container,
    client: getContainerClient(container),
  }));
}
