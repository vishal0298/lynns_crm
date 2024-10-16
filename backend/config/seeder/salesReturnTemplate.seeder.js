const mongoose = require("mongoose");
const salesReturnTemplateModel = require("../../api/templates/sales_return_template/models/salesReturn_template.model")
const userModel = require("../../api/auth/models/auth.model")


exports.salesReturnTemplateSeeding = async () =>{

    try {
       const salesReturnTemplateRecord = await salesReturnTemplateModel.findOne().lean();


       if(salesReturnTemplateRecord){
        return;
       }
       else{
        const userRecord = await userModel.findOne().lean();
        const salesReturnTemplateRecord = await salesReturnTemplateModel.create({
            
            default_sales_return_template : "1",
            userId: userRecord._id
 
        });
       }
    } catch (error) {
        console.log('error', error)
    }
}

