const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const multer = require('multer');

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("_id name email bio avatarUrl");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}



exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const { name, bio } = req.body;

        const update = await User.findByIdAndUpdate(
            userId,
            { name, bio },
            { new: true }
        )

        res.json({ message: "User updated successfully", Updated_user: update });

    } catch (error) {
        res.status(500).json({ message: "Error updating user!!!" });
    }
}



exports.changepassword = async (req, res) => {
    try {
        const userId = req.userId;

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found!!!" });
        }

        if (currentPassword == newPassword){
            return res.status(400).json({message: "new password is same as current password. Please enter different password."})
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Old password doesn't match!!!" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        user.password = hashed;
        await user.save();

        res.json({ message: "Password changed successfully!!!" })
    } catch (error) {

    }
}



exports.avatar = async (req, res) => {
    try {
        const userId = req.userId

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const avatarUrl = '/uploads/avatar/' + req.file.filename;

        const user = await User.findByIdAndUpdate(
            userId,
            {avatarUrl},
            {new: true}
        ).select("avatarUrl");

        res.json({message: "Image URL added successfully", user});
    } catch (error) {
        res.status(500).json({message: "Image upload failed!!!"});
    }
}






