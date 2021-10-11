const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" }); // upload 라는 변수로 객체로 반환 받고 key:desti value:"uploads"
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
});
// form-data(이미지와같은파일)을 멀터함수를 사용하여 객체로반환하는데 "반환하고싶은경로"
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/products", (req, res) => {
  models.Product.findAll({
    order: [["createdAt", "asc"]], // db table 순서 정함 , created(생성일짜순) , 내림차순 으로 정렬 해서 모두 가져옴
    attributes: ["id", "name", "price", "createdAt", "seller", "imageUrl"] // 받고싶은 속성만 기입
  })
    .then(result => {
      res.send({ products: result });
    })
    .catch(error => {
      console.err(error);
    });
}); // table에 있는 모든 data 가져옴
//http 통신시 json 데이터를 body에 담아 전송하는데 파일이 큰경우
//multer 파일업로드 할때 큰용량의 데이터 multipart/form-data 처리하기 위해서 사용
// image 경로에서   image 키값을 가진 multipart/form-data 형태의 파일을 하나만 보내준다
app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path
  });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;
  if (!name || !description || !price || !seller || !imageUrl) {
    res.send("모든 필드를 작성해주세요");
    // 하나라도 요소가 빠져있을때 방어 코드작성
  }
  models.Product.create({
    name,
    description,
    price,
    seller,
    imageUrl
  })
    .then(result => {
      console.log("상품 생성결과:", result);
      res.send({
        result
      });
    })
    .catch(error => {
      console.log("error", error);
      res.send("상품 업로드에 문제가 발생했습니다.");
    });
  // res.send({
  //   body: body,
  // });
  // res.send('상품이 등록되었습니다.');
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    // where 조건 문
    // params (url에서 받은 id) 값이 where 의 id key와 params(id)가 일치하는 값을 가져옴
    where: {
      id: id
    }
  })
    .then(result => {
      console.log("Product:", result);
      res.send({
        product: result
      });
    })
    .catch(error => {
      console.error(error);
      res.send("상품 조회에 에러가 발생했습니다");
    });
});
app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다");
  models.sequelize
    .sync()
    .then(() => {
      console.log("db연결 성공");
    })
    .catch(err => {
      console.log("db연결 에러");
      process.exit();
    }); //db모델링 관련설정 , sequelize init 을 통해 생성된 코드들, 데이터베이스를 동기화하는 과정
});
//postman 에서 post 요청 해서 storage api의 upload 경로에 image url 이 있다
//image url 을 전송컴포넌트를 눌렀을때 화면전환(imageURL 불러오는로직)
