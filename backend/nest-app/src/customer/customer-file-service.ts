import { Injectable } from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { Multer } from "multer";
import * as fs from 'fs';
import path from "path";

@Injectable()
export class CustomerFileService {
    constructor(private readonly customerService: CustomerService) {

    }
    async handleCustomerImage(id: number, file: Express.Multer.File) {
        if (!file) return null;
        try{
            const customerDir=path.join('uploads','customers',String(id));
            if(!fs.existsSync(customerDir)){
                fs.mkdirSync(customerDir,{recursive:true});
            }
            const ext=path.extname(file.originalname);
            const finalFileName=`customerInage${Date.now()}${ext}`;
            const finalPath=path.join(customerDir,finalFileName);
            await fs.promises.rename(file.path,finalPath);
            const imagePath=finalPath.replace(/\\/g,'/');
            const customer=await this.customerService.updateCustomer(id,{image:imagePath});
            return {
                path:imagePath,
                fileName:finalFileName,
                customer
            };
        }catch(error){
            throw new Error("failed to handle customer files");
        }

    }

    async removeCustomerImage(id:number){
        const customer=await this.customerService.findOne(id);
        if(customer.image && fs.existsSync(customer.image)){
            await fs.promises.unlink(customer.image);
        }
        return this.customerService.updateCustomer(id,{image:''});
    }
}