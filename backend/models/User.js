const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    budgetLimit: {
      type: Number,
      default: 50000,
    },
    categoryBudgets: {
      type: Map,
      of: Number,
      default: {
        Food: 8333,
        Transport: 8333,
        Entertainment: 8333,
        Utilities: 8333,
        Healthcare: 8333,
        Other: 8335,
      },
    },
    monthlyBudgets: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    currency: {
      type: String,
      default: "INR",
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to return user without password
userSchema.methods.toJSON = function () {
  const user = this.toObject({ flattenMaps: true });
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);