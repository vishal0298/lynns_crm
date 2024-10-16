const mongoose = require("mongoose");
const purchaseOrderTemplateModel = require("../../api/templates/purchase_order_template/models/purchaseOrd_template.model")
const userModel = require("../../api/auth/models/auth.model")


exports.purchaseOrderTemplateSeeding = async () =>{

    try {
       const purchaseOrderTemplateRecord = await purchaseOrderTemplateModel.findOne().lean();


       if(purchaseOrderTemplateRecord){
        return;
       }
       else{
        const userRecord = await userModel.findOne().lean();
        const purchaseOrderTemplateRecord = await purchaseOrderTemplateModel.create({
            
            default_purchaseOrder_template : "1",
            userId: userRecord._id
 
        });
       }
    } catch (error) {
        console.log('error', error)
    }
}

