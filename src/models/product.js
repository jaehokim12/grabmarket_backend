module.exports = function (sequelize, DataTypes) {
  const product = sequelize.define('Product', {
    // sequelize 가 product.js(dB table)를 읽어서 db에 명령한다.
    // table 이름이 'Product'
    name: {
      type: DataTypes.STRING(20),
      allowNull: false, // 값이 없어도 되는지 유무 false -> 값이 무조건 있어야함
    },
    price: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    seller: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
  });
  return product;
};
