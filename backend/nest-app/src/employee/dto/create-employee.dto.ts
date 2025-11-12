export class CreateEmployeeDto {
    id:number
    name:string
    email:string
    phone:string
    password:string
    otp:string
    otpExpiry:Date
    totalLogin:number
    totalAttempt:number
    image:string
    emailVerification:number
    phoneVerification:number
    status:number
    otpLastSentAt: Date;
    addedDate:Date
    registrationDay:string
    address:string
    salary:number
    role_id:number
}
