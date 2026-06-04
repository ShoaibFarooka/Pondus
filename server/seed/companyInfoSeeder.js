const mongoose = require('mongoose');
const CompanyInfo = require('../models/companyInfoModel');
require('dotenv').config({ path: './configs/.env' });

async function seedCompanyInfo(info) {
    const DB = process.env.DB_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB);
    console.log('Connected to MongoDB');
    try {
        await CompanyInfo.deleteMany({});
        console.log('Deleted existing company info');
        console.log('Seeding company info...');
        const { name, address, city, zip, type, logo } = info;
        await CompanyInfo.create({
            name,
            address,
            city,
            zip,
            type,
            logo
        });
        console.log('Company Info Seeded Successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

const companyInfo = {
    name: "Demo Company",
    address: "Guldbergsgade 12E",
    city: "Silkeborg",
    zip: "8700",
    type: "Traditional Gym",
    logo: "https://img.freepik.com/free-vector/linear-flat-go-logo-template_23-2148973724.jpg"
}

seedCompanyInfo(companyInfo);
