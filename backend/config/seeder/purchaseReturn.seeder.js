const mongoose = require("mongoose");
const purchaseReturnTemplateModel = require("../../api/templates/purchase_return_template/models/purchaseReturn_template.model")
const userModel = require("../../api/auth/models/auth.model")


exports.purchaseOrderTemplateSeeding = async () =>{

    try {
       const purchaseReturnTemplateRecord = await purchaseReturnTemplateModel.findOne().lean();


       if(purchaseReturnTemplateRecord){
        return;
       }
       else{
        const userRecord = await userModel.findOne().lean();
        const purchaseReturnTemplateRecord = await purchaseReturnTemplateModel.create({
            
            default_purchase_return_template : "1",
            userId: userRecord._id
 
        });
       }
    } catch (error) {
        console.log('error', error)
    }
}

