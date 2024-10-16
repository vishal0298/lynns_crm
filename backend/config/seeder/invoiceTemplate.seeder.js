const mongoose = require("mongoose");
const invoiceTemplateModel = require("../../api/templates/invoice_template/models/invoice_template.models")
const userModel = require("../../api/auth/models/auth.model")


exports.invoiceTemplateSeeding = async () =>{

    try {
       const invoiceTemplateRecord = await invoiceTemplateModel.findOne().lean();


       if(invoiceTemplateRecord){
        return;
       }
       else{
        const userRecord = await userModel.findOne().lean();
        const invoiceTemplateRecord = await invoiceTemplateModel.create({
            
            default_invoice_template : "1",
            userId: userRecord._id
 
        });
       }
    } catch (error) {
        console.log('error', error)
    }
}

