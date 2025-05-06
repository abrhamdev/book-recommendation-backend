import bcrypt from 'bcrypt';

const hashPassword = async (plainText) => {

  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);

};

export default hashPassword;
