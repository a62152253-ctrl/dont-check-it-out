export function sanitizeSecretName(name: string): string {
  return name.replace(/[<>]/g, ""); // Basic cross-site injection removal
}

export function validateIpAddress(ip: string): boolean {
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  return ipv4Regex.test(ip);
}
