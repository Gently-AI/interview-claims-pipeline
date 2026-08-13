import { ContainerClient } from "@azure/storage-blob";
import { CONTAINERS, containerUrl } from "./config.js";

/** A client for a single container. */
export function getContainerClient(container: string): ContainerClient {
  return new ContainerClient(containerUrl(container));
}

/** Clients for each configured container, paired with its name. */
export function getAllContainerClients(): { container: string; client: ContainerClient }[] {
  return CONTAINERS.map((container) => ({ container, client: getContainerClient(container) }));
}
