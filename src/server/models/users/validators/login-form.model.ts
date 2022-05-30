import { FormikValidatorBase, IsNotEmpty, IsString } from "formik-class-validator";

export class LoginFormModel extends FormikValidatorBase {
    @IsNotEmpty({ message: "Username tidak boleh kosong!" })
    @IsString()
    username: string = "";

    @IsNotEmpty({ message: "Password tidak boleh kosong!" })
    @IsString()
    password: string = "";
}
