const Product = require('../models/product');
const Ingredient = require('../models/ingredient');

const getProductDetails = async (req, res) => {
  const barcode = req.params.barcode;

  try {
    // Supondo que você tenha uma lógica para buscar produtos pelo código de barras
    const product = await Product.findOne({ where: { barcode } });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const ingredients = await Ingredient.findAll({
      where: { productId: product.id },
      order: [['porcentagemAlergia', 'DESC']],
      limit: 3,
    });

    const response = {
      nome: product.nome,
      ingredientes: ingredients.map(ingredient => ({
        nome: ingredient.nome,
        toxicidade: getToxicityColor(ingredient.porcentagemAlergia),
      })),
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar produto' });
  }
};

const getToxicityColor = (porcentagemAlergia) => {
  if (porcentagemAlergia < 10) {
    return 'verde'; // Baixo risco
  } else if (porcentagemAlergia < 30) {
    return 'amarelo'; // Médio risco
  } else {
    return 'vermelho'; // Alto risco
  }
};

module.exports = {
  getProductDetails,
};
