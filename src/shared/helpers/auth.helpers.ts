import { randomBytes, scrypt } from "crypto";

import randomString from "randomstring";

const hash = (password) => {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(8).toString("hex");

    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
};

const verify = (password, hash) => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString("hex"));
    });
  });
};

const generateToken = () => {
  return randomString.generate();
};

const generateOtp = () => {
  return randomString.generate({
    length: 6,
    charset: "numeric"
  });
};

export const AuthHelpers = {
  hash,
  verify,
  generateToken,
  generateOtp
};
