const mongoose = require("mongoose");
const quotationTemplateModel = require("../../api/templates/quotation_template/models/quotation_template.model")
const userModel = require("../../api/auth/models/auth.model")


exports.invoiceTemplateSeeding = async () =>{

    try {
       const quotationTemplateRecord = await quotationTemplateModel.findOne().lean();


       if(quotationTemplateRecord){
        return;
       }
       else{
        const userRecord = await userModel.findOne().lean();
        const quotationTemplateRecord = await quotationTemplateModel.create({
            
            default_quotation_template : "1",
            userId: userRecord._id
 
        });
       }
    } catch (error) {
        console.log('error', error)
    }
}

