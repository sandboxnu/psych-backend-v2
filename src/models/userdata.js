const userdata = (sequelize, DataTypes) => {
    const UserData = sequelize.define('userdata', {
      participantId: {
        type: DataTypes.STRING,
        unique: false,
      },
    });
    return UserData;
  };
  export default userdata;