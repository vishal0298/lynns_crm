const mongoose = require("mongoose");
const purchaseTemplateModel = require("../../api/templates/purchase_template/models/purchase_template.model")
const userModel = require("../../api/auth/models/auth.model")


exports.purchaseTemplateSeeding = async () =>{

    try {
       const purchaseTemplateRecord = await purchaseTemplateModel.findOne().lean();
 
       if(purchaseTemplateRecord){
        return;
       }
       else{
        const userRecord = await userModel.findOne().lean();
        const purchaseTemplateRecord = await purchaseTemplateModel.create({
            
            default_purchase_template : "1",
            userId: userRecord._id
 
        });
       }
    } catch (error) {
        console.log('error', error)
    }
}

