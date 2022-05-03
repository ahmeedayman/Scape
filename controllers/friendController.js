const User = require("../models/users");
const mongoose = require("mongoose");
exports.addOrRemove = async (req, res) => {
  try {
    const userId = req.body.userId;
    const personId = req.body.personId;

    const members = await User.find({
      id: {
        $in: [
          mongoose.Types.ObjectId(userId),
          mongoose.Types.ObjectId(personId),
        ],
      },
    });

    const person = members.find((member) => {
      return member._id.toString() === personId;
    });

    const user = members.find((member) => {
      return member._id.toString() === userId;
    });

    const index = user.friends.findIndex((friend) => {
      return friend.toString() === personId;
    });

    if (index !== -1) {
      const userIndex = person.friends.findIndex((friend) => {
        return friend.toString() === userId;
      });
      user.friends.splice(index, 1);
      person.friends.splice(userIndex, 1);
      await person.save();
      await user.save();
      res.status(200).json({ msg: "friend removed" });
    } else {
      user.friends.push(person._id.toString());
      person.friends.push(user._id.toString());

      await person.save();
      user.save();
      res.status(200).json({ msg: "friend added" });
    }
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
  }
};
