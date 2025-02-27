"use client"

import * as React from 'react';
import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { smartAccount } from '@/lib/usdc-aa';
import { IFormValues } from '@/lib/utils'
import { useForm } from "react-hook-form"
import { transferUSDC } from '@/lib/transfer-service'

export function AaUsdcTx() {
  const { register, handleSubmit,} = useForm<IFormValues>();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    await transferUSDC(data.recipient, data.amount)
  })
  
  return (
    <>
      <Stack gap="2" align="flex-start">
        Smart Account is: {smartAccount.address}
      </Stack>
      <form onSubmit={onSubmit}>
        <Stack gap="4" align="flex-start" maxW="sm">
          <Field.Root>
            <Field.Label>Recipient</Field.Label>
            <Input
              {...register("recipient", { required: "Recipient address is required" })}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Amount</Field.Label>
            <Input
              {...register("amount", { required: "Amount is required" })}
            />
          </Field.Root>
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    </>
  )
}