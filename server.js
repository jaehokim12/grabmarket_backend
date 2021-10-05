const express = require('express');
const cors = require('cors');
const app = express();
const models = require('./models');
const port = 8080;

app.use(express.json());
app.use(cors());
//
app.get('/products', (req, res) => {
  models.Product.findAll({
    order: [['createdAt', 'DESC']], // db table 순서 정함 , created(생성일짜순) , 내림차순 으로 정렬 해서 모두 가져옴
    attributes: ['id', 'name', 'price', 'createdAt', 'seller'], // 받고싶은 속성만 기입
  })
    .then(result => {
      res.send({ products: result });
    })
    .catch(error => {
      console.err(error);
    });
}); // table에 있는 모든 data 가져옴
// res.send({
//   products: [
//     {
//       id: 1,
//       name: '농구공',
//       price: 100000,
//       seller: '조던',
//       imageUrl: 'images/products/basketball1.jpeg',
//     },
//     {
//       id: 2,
//       name: '축구공',
//       price: 50000,
//       seller: '메시',
//       imageUrl: 'images/products/soccerball1.jpg',
//     },
//     {
//       id: 3,
//       name: '키보드',
//       price: 10000,
//       seller: '그랩',
//       imageUrl: 'images/products/keyboard1.jpg',
//     },
//   ],
// });

app.post('/products', (req, res) => {
  const body = req.body;
  const { name, description, price, seller } = body;
  if (!name || !description || !price || !seller) {
    res.send('모든 필드를 작성해주세요');
    // 하나라도 요소가 빠져있을때 방어 코드작성
  }
  models.Product.create({
    name,
    description,
    price,
    seller,
  })
    .then(result => {
      console.log('상품 생성결과:', result);
      res.send({
        result,
      });
    })
    .catch(error => {
      console.log('error', error);
      res.send('상품 업로드에 문제가 발생했습니다.');
    });
  // res.send({
  //   body: body,
  // });
  // res.send('상품이 등록되었습니다.');
});

app.get('/products/:id', (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    // where 조건 문
    // params (url에서 받은 id) 값이 where 의 id key와 params(id)가 일치하는 값을 가져옴
    where: {
      id: id,
    },
  })
    .then(result => {
      console.log('Product:', result);
      res.send({
        product: result,
      });
    })
    .catch(error => {
      console.error(error);
      res.send('상품 조회에 에러가 발생했습니다');
    });
});
app.listen(port, () => {
  console.log('그랩의 쇼핑몰 서버가 돌아가고 있습니다');
  models.sequelize
    .sync()
    .then(() => {
      console.log('db연결 성공');
    })
    .catch(err => {
      console.log('db연결 에러');
      process.exit();
    }); //db모델링 관련설정 , sequelize init 을 통해 생성된 코드들, 데이터베이스를 동기화하는 과정
});
