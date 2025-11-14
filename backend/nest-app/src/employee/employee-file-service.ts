import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from 'path';
import { EmployeeService } from "./employee.service";

@Injectable()
export class EmployeeFileService {
  constructor(private readonly employeeService: EmployeeService) {}

  async handleEmployeeFile(id: number, file: Express.Multer.File) {
    if (!file) return null;

    try {
      const employeeDir = path.join('uploads', 'employees', String(id));
      if (!fs.existsSync(employeeDir)) {
        fs.mkdirSync(employeeDir, { recursive: true });
      }

      const ext = path.extname(file.originalname);
      const finalFileName = `EmployeeImage_${Date.now()}${ext}`;
      const finalPath = path.join(employeeDir, finalFileName);

      // Move uploaded file to final destination
      await fs.promises.rename(file.path, finalPath);

      const imagePath = finalPath.replace(/\\/g, '/');

      // Update employee record
      const employee = await this.employeeService.updateEmployee(id, { image: imagePath });

      return {
        path: imagePath,
        fileName: finalFileName,
        employee,
      };

    } catch (error) {
      throw new Error(`Failed to handle employee file: ${error.message}`);
    }
  }

  async removeEmployeeFile(id: number) {
    const employee = await this.employeeService.findOne(id);
    if (employee.image && fs.existsSync(employee.image)) {
      await fs.promises.unlink(employee.image);
    }
    return this.employeeService.updateEmployee(id, { image: '' });
  }
}
