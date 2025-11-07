import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
  
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'login_registration',
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // dev only
    }),
    EmployeeModule,
    ProductModule,
    CategoryModule,
    AuthModule,
    RoleModule,
  ],
})
export class AppModule {}

