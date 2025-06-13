const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Conexão com MongoDB
mongoose.connect('mongodb://localhost:27017/catcat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema do carro
const gatoSchema = new mongoose.Schema({
  nome: String,
  cor: String,
  photo: String,
  latitude: String,
  longitude: String,
});

const gato = mongoose.model('gato', gatoSchema); 

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do Multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Rotas
app.get('/gatos', async (req, res) => {
  const data = await gato.find();
  res.json(data);
});

app.post('/gatospost', upload.single('photo'), async (req, res) => {
  const { nome, cor, latitude, longitude } = req.body;
  const photo = req.file ? req.file.filename : null;

  const newgato = new Car({nome, cor, latitude, longitude, photo });
  await newgato.save();

  res.json({ success: true });
});

app.listen(PORT, () =>
  console.log(`🔥 Server running on http://localhost:${PORT}`)
);
