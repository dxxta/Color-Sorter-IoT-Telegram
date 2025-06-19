import { hash, compare, genSalt } from "bcrypt";

export const generatePassword = async (password: string) => {
  try {
    const newPassword: string = await genSalt(12).then(async (salt: string) => {
      return await hash(password, salt).then((hash: string) => {
        return hash;
      });
    });
    if (!newPassword) throw new Error("Password no result");
    return newPassword;
  } catch (error) {
    throw error;
  }
};

export const validatePassword = async (
  provided_password: string,
  target_password: string
) => {
  try {
    const result = await compare(target_password, provided_password);
    if (!provided_password || !target_password || !result) {
      throw new Error("Password does not matched");
    }
  } catch (error) {
    throw error;
  }
};
