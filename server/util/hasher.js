import bcrypt from 'bcryptjs';

const saltIterations = 12;

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltIterations);
    return await bcrypt.hash(password, salt);
}

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

export { hashPassword, comparePassword };
export default { hashPassword, comparePassword };