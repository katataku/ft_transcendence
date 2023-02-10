import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserCreateReqDto, UserCreateResDto, UserGetDto } from "src/common/dto/users.dto";

@Controller('user')
export class UsersController {
	constructor(private service: UsersService) {}

	@Post()
	createUser(@Body() body: UserCreateReqDto): Promise<UserCreateResDto> {
		return this.service.create(body)
	}

	@Get(':id')
	getUserById(@Param('id') param: number): Promise<UserGetDto> {
		return this.service.getById(param)
	}
}