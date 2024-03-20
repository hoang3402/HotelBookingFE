"use client";

import { domain } from "@/app/actions/getRoomById";
import Button from "@/app/components/Button";
import Container from "@/app/components/Container";
import Input from "@/app/components/inputs/Input";
import Loader from "@/app/components/Loader";
import { User } from "@/app/type";
import { Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";


const ManagerUserPage = ({ params }: { params: { id: string } }) => {

	const [isLoading, setIsLoading] = useState(true)
	const route = useRouter()
	const token = useAuthHeader()

	const {
		register,
		handleSubmit,
		setValue,
		formState: {
			errors,
		},
	} = useForm<FieldValues>({
		defaultValues: {
			first_name: "",
			last_name: "",
			email: "",
			number_phone: "",
			role: "",
			is_active: true,
			password: ""
		},
	})


	useEffect(() => {

		if (params.id === '0') {
			setIsLoading(false)
			return
		}

		fetch(`${domain}api/auth/user/${params.id}/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `${token}`
			}
		}).then(res => res.json())
			.then((res: User) => {
				setValue('first_name', res.first_name)
				setValue('last_name', res.last_name)
				setValue('email', res.email)
				setValue('number_phone', res.number_phone)
				setValue('role', res.role)
				setValue('is_active', res.is_active)
				setIsLoading(false)
			})
	}, [])


	function handleCancel(): void {
		route.back()
	}

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		let url = `${domain}api/auth/user/${params.id}/edit/`
		if (params.id === '0') {
			url = `${domain}api/auth/user/create/`
		} else {
			data.password = undefined
		}
		fetch(url, {
			method: params.id === '0' ? "POST" : "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `${token}`
			},
			body: JSON.stringify(data)
		}).then(res => res.ok ?
			toast.success('Update user success!') :
			toast.error('Update user failed!'))
			.then(_ => {
				route.back()
			})
	}

	return (
		<div>
			{isLoading ? (
				<Loader />
			) : (
				<Container>
					<div className="flex flex-col gap-4 mt-4">
						<div className="flex gap-4">
							<Input
								id={"first_name"}
								errors={errors}
								register={register}
								label="First Name"
								optional={{
									required: "First name is required",
									minLength: {
										value: 2,
										message: "First name must have at least 2 characters",
									}
								}}
							/>
							<Input
								id={"last_name"}
								errors={errors}
								register={register}
								label="Last Name"
								optional={{
									required: "Last name is required",
									minLength: {
										value: 2,
										message: "Last name must have at least 2 characters",
									}
								}}
							/>
						</div>
						<Input
							id={"email"}
							errors={errors}
							register={register}
							label="Email"
							optional={{
								required: "Email is required",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: "Invalid email address",
								}
							}}
						/>
						{params.id === '0' && (
							<Input
								id={"password"}
								errors={errors}
								register={register}
								label="Password"
								optional={params.id === '0' ? {
									required: "Password is required",
									minLength: {
										value: 6,
										message: "Password must have at least 6 characters",
									}
								} : {}}
							/>
						)}
						<Input
							id={"number_phone"}
							errors={errors}
							register={register}
							label="Number phone"
							optional={{
								required: "Number phone is required",
								minLength: {
									value: 10,
									message: "Number phone is required",
								}
							}}
						/>
						<div className="flex gap-4 justify-center items-center m-auto">
							<Card className="p-4">
								<div className="flex items-center gap-2">
									<label htmlFor="role">Role: </label>
									<select
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										{...register("role", { required: true })}
									>
										<option value="user">user</option>
										<option value="staff">staff</option>
										<option value="admin">admin</option>
									</select>
								</div>
							</Card>
							<Card className="p-6">
								<div className="flex items-center gap-2">
									<label htmlFor="is_active">Is active: </label>
									<input type="checkbox" {...register("is_active")} />
								</div>
							</Card>
						</div>
						<div className="flex gap-5">
							<Button
								label={params.id === '0' ? "Create" : "Update"}
								onClick={() => handleSubmit(onSubmit)()}
							/>
							<Button label="Cancel" onClick={handleCancel} />
						</div>
					</div>
				</Container>
			)}
		</div>
	)
}

export default ManagerUserPage