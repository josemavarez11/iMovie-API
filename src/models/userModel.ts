import bcrypt from "bcrypt";
import { getModelForClass, prop, pre } from "@typegoose/typegoose";

@pre<User>("save", async function (next) {
    if (!this.isModified("password")) return next(); // If password is not modified, skip hashing
    
    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        this.password = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt
        next(); // Proceed to save the document
    } catch (error: any) {
        next(error); // Pass any error to the next middleware
    }
})
class User {
    @prop({ required: true, unique: false })
    nickname!: string;

    @prop({ required: true, unique: true })
    email!: string;

    @prop({ required: true, unique: false })
    password!: string;

    @prop({ default: false, unique: false })
    deleted?: boolean;

    async comparePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password); // Compare plain text password with hashed password
    }

    compareNickname(nickname: string): boolean {
        return nickname === this.nickname;
    }

    compareEmail(email: string): boolean {
        return email === this.email;
    }
}

const UserModel = getModelForClass(User);

export default UserModel;
