import { Schema, model } from "mongoose";
import { isEmail } from "validator";
import { hashPassword, comparePasswords } from "../utils/hash";

const userSchema = Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate(value) {
                isEmail(value);
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            maxlength: 50,
            select: false, // exclude from the query results by default.
        },
        address: {
            type: [String],
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 10,
            maxlength: 10,
        },
        role: {
            type: String,
            enum: ["seller", "admin", "customer"],
            default: "customer",
        },
        company: {
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 50,
            required: () => {
                this.role === "seller";
            },
        },
    },
    { timestamps: true }
);

// userSchema.index({ name: 1, email: 1 }, { unique: true });

// DOCUMENT MIDDLEWARE: runs before .save() and .create() !.update()
userSchema.pre("save", async (next) => {
    if (!this.isModified("password")) return next();

    this.password = await hashPassword(this.password);

    next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
    if (!this._update.password) return next();

    this._update.password = await hashPassword(this._update.password);

    next();
});

userSchema.statics.isEmailTaken = (email) => this.findOne({ email });

userSchema.methods.isPasswordMatch = (password) =>
    comparePasswords(this.password, password);

userSchema.methods.seeRepositoryOfPingo;

const User = model("User", userSchema);

export default User;