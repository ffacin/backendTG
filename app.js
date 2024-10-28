const express = require('express');
const sequelize = require('./config/database'); // Supondo que você tenha um arquivo database.js para o Sequelize
const { DataTypes } = require('sequelize');
const cors = require('cors'); // Adicionando CORS para permitir requisições do frontend

const app = express();
const PORT = process.env.PORT || 5656;

// Habilitar o CORS
app.use(cors());

// Definindo os modelos
const Product = sequelize.define('ProductsTG', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: DataTypes.STRING,
    barcode: DataTypes.STRING,
}, { timestamps: false });

const Ingredient = sequelize.define('IngredientsTG', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: DataTypes.STRING,
    porcentagemAlergia: DataTypes.FLOAT,
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        }
    },
}, { timestamps: false });

// Definindo as associações
Product.hasMany(Ingredient, { foreignKey: 'productId', sourceKey: 'id', as: 'ingredients' });
Ingredient.belongsTo(Product, { foreignKey: 'productId', targetKey: 'id' });

// Rota para buscar produtos e seus ingredientes
app.get('/cosmeticos/:barcode', async (req, res) => {
    try {
        const barcode = req.params.barcode;
        console.log(`Buscando produto com o barcode: ${barcode}`);

        const product = await Product.findOne({
            where: { barcode: barcode },
            include: [{
                model: Ingredient,
                as: 'ingredients' // Usando o alias definido
            }]
        });

        if (!product) {
            console.log('Produto não encontrado');
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        const response = {
            nome: product.nome,
            ingredientes: product.ingredients.map(ingredient => ({
                nome: ingredient.nome,
                porcentagemAlergia: ingredient.porcentagemAlergia
            }))
        };

        res.json(response);
    } catch (error) {
        console.error('Erro ao buscar o produto:', error);
        res.status(500).json({ message: 'Erro ao buscar o produto', error: error.message });
    }
});

// Sincronizando o banco de dados e iniciando o servidor
sequelize.sync({ alter: true }) 
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => { // Alterado para '0.0.0.0' para que o servidor esteja acessível em toda a rede
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Erro ao sincronizar o banco de dados:', error);
    });
