var express = require('express');
var router = express.Router();
var product_info = require('../Models/Product');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

// Add Product Form
router.get('/AddProduct', function (req, res) {
  res.render('AddProduct');
});

// Add Product (POST)
router.post('/AddProduct', function (req, res) {
  if (!req.files || !req.files.Upload) {
    return res.status(400).send('No file was uploaded.');
  }

  const uploadedFile = req.files.Upload;
  const uploadPath = './public/Upload/' + uploadedFile.name;

  const product = new product_info({
    name: req.body.txt1,
    price: req.body.txt2,
    description: req.body.txt3,
    Upload: uploadedFile.name
  });

  product.save()
    .then(() => {
      uploadedFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        res.redirect('/DisplayProduct');
      });
    })
    .catch(err => console.log('Error in Inserting Data: ' + err));
});

// Add Product API
router.post('/Add-Api', function (req, res) {
  const uploadedFile = req.files.Upload;
  const bodydata = {
    name: req.body.txt1,
    price: req.body.txt2,
    description: req.body.txt3,
    Upload: uploadedFile.name
  };
  var product = new product_info(bodydata);
  product.save();
  res.json({ status: 200, flag: 1, message: "Data Inserted" });
});

// Display Products
router.get('/DisplayProduct', function (req, res) {
  product_info.find()
    .then(data => res.render('DisplayProduct', { data }))
    .catch(err => console.log('Error in Display: ' + err));
});

// Display Products API
router.post('/Display-Api', function (req, res) {
  product_info.find()
    .then(data => res.json({ status: 200, flag: 1, message: "Product Data Fetched Successfully", data }))
    .catch(err => res.status(500).json({ status: 500, flag: 0, message: 'Error fetching Product data', error: err }));
});

// GET Edit form
router.get('/Edit/:id', function (req, res) {
  product_info.findById(req.params.id)
    .then(product => {
      if (!product) return res.status(404).send('Product not found');
      res.render('Edit', { product }); // FIXED: matches Edit.ejs
    })
    .catch(err => console.log("Error in fetching product: " + err));
});

// POST Edit update
router.post('/Edit/:id', function (req, res) {
  let updateData = {
    name: req.body.txt1,
    price: req.body.txt2,
    description: req.body.txt3
  };

  if (req.files && req.files.Upload) {
    const uploadedFile = req.files.Upload;
    const uploadPath = './public/Upload/' + uploadedFile.name;
    updateData.Upload = uploadedFile.name;

    uploadedFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
      product_info.findByIdAndUpdate(req.params.id, updateData, { new: true })
        .then(() => res.redirect('/DisplayProduct'))
        .catch(err => console.log("Error updating product: " + err));
    });
  } else {
    // If no new image is uploaded, keep old image
    product_info.findById(req.params.id)
      .then(product => {
        updateData.Upload = product.Upload;
        return product_info.findByIdAndUpdate(req.params.id, updateData, { new: true });
      })
      .then(() => res.redirect('/DisplayProduct'))
      .catch(err => console.log("Error updating product: " + err));
  }
});

// Delete Product
router.get('/delete/:id', function (req, res) {
  product_info.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/DisplayProduct'))
    .catch(err => console.log("Error in Deleting"));
});

module.exports = router;
console.log(`http://127.0.0.1:5001`)