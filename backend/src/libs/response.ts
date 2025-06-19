interface bodyResponse {
  success?: boolean;
  message?: string;
}

export const responseWrapper = <T extends bodyResponse>(args: T) => {
  return args;
};
